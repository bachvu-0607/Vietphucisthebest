// Automated verification script for Viet Phuc Remix
// Tests: 2 accounts, wardrobe isolation, guest limits, 5/day AI quota, concurrency lock, and durability

const BASE_URL = 'http://localhost:3000/api';

async function req(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      const data = await res.json().catch(() => ({}));
      return { status: res.status, ok: res.ok, data };
    } catch (err) {
      if (attempt === 2) throw err;
      await new Promise(r => setTimeout(r, 600));
    }
  }
}

async function waitForJob(jobId, token, maxWaitSeconds = 45) {
  const start = Date.now();
  while ((Date.now() - start) < maxWaitSeconds * 1000) {
    await new Promise(r => setTimeout(r, 1000));
    const check = await req(`/ai/jobs/${jobId}`, { headers: { Authorization: `Bearer ${token}` } });
    const s = check.data.data?.status;
    if (s === 'completed' || s === 'failed') {
      return check.data.data;
    }
  }
  throw new Error(`Quá thời gian ${maxWaitSeconds}s chờ job ${jobId}`);
}

async function runTests() {
  console.log('=== STARTING AUTOMATED VERIFICATION ===\n');

  // TEST 1: Public Guest Access
  console.log('[TEST 1] Kiểm tra quyền Khách (Guest)...');
  const costumes = await req('/costumes');
  if (costumes.status === 200 && costumes.data.data.length > 0) {
    console.log('  ✓ Khách xem được kho cổ phục công khai:', costumes.data.data.length, 'bộ');
  } else {
    throw new Error('Khách không xem được cổ phục!');
  }

  const guestDraft = await req('/drafts', {
    method: 'POST',
    body: JSON.stringify({ costumeId: 'cos-nhat-binh', title: 'Phác thảo khách' })
  });
  if (guestDraft.status === 401) {
    console.log('  ✓ Khách bị từ chối lưu bản phác thảo (HTTP 401):', guestDraft.data.error);
  } else {
    throw new Error('Khách không bị chặn khi lưu draft!');
  }

  const guestAI = await req('/ai/jobs', {
    method: 'POST',
    body: JSON.stringify({ costumeId: 'cos-nhat-binh', costumeName: 'Áo Nhật Bình', sketchDataUrl: 'data:image/png;base64,mock' })
  });
  if (guestAI.status === 401) {
    console.log('  ✓ Khách bị từ chối tạo ảnh AI (HTTP 401):', guestAI.data.error);
  } else {
    throw new Error('Khách không bị chặn khi tạo ảnh AI!');
  }

  // TEST 2: Register Account A and Account B
  console.log('\n[TEST 2] Đăng ký 2 tài khoản riêng biệt...');
  const emailA = `anh_${Date.now()}@vietphuc.vn`;
  const emailB = `binh_${Date.now()}@vietphuc.vn`;

  const regA = await req('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email: emailA, name: 'Nguyễn Văn Ánh', password: 'password123' })
  });
  if (regA.status !== 201) throw new Error('Đăng ký tài khoản A thất bại: ' + JSON.stringify(regA.data));
  const tokenA = regA.data.data.token;
  const userA = regA.data.data.user;
  console.log('  ✓ Tài khoản A đăng ký thành công:', userA.name, `(${userA.email})`);

  const regB = await req('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email: emailB, name: 'Trần Thị Bình', password: 'password456' })
  });
  if (regB.status !== 201) throw new Error('Đăng ký tài khoản B thất bại: ' + JSON.stringify(regB.data));
  const tokenB = regB.data.data.token;
  const userB = regB.data.data.user;
  console.log('  ✓ Tài khoản B đăng ký thành công:', userB.name, `(${userB.email})`);

  // TEST 3: Wardrobe Isolation (Tủ đồ riêng & Phân quyền máy chủ)
  console.log('\n[TEST 3] Kiểm tra Tủ đồ riêng và Bảo mật dữ liệu người dùng...');
  const saveDraftA = await req('/drafts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({
      costumeId: 'cos-nhat-binh',
      title: 'Nhật Bình Hoàng Gia của Ánh',
      selectedColorId: 'col-nb-red',
      selectedMaterialId: 'mat-gam-hue',
      sketchDataUrl: 'data:image/png;base64,draftA'
    })
  });
  if (saveDraftA.status !== 200) throw new Error('Tài khoản A lưu draft thất bại: ' + JSON.stringify(saveDraftA.data));
  const draftIdA = saveDraftA.data.data.id;
  console.log('  ✓ Tài khoản A đã lưu bản phối:', draftIdA);

  // Check Account A sees it
  const listA = await req('/drafts', { headers: { Authorization: `Bearer ${tokenA}` } });
  if (listA.data.data.length !== 1 || listA.data.data[0].id !== draftIdA) {
    throw new Error('Tài khoản A không thấy draft của mình!');
  }
  console.log('  ✓ Tài khoản A thấy đúng 1 bản phối của mình trong tủ đồ.');

  // Check Account B sees NOTHING
  const listB = await req('/drafts', { headers: { Authorization: `Bearer ${tokenB}` } });
  if (listB.data.data.length !== 0) {
    throw new Error('LỖI BẢO MẬT: Tài khoản B nhìn thấy dữ liệu của Tài khoản A!');
  }
  console.log('  ✓ Tài khoản B kiểm tra tủ đồ: 0 bản phối (cách ly hoàn toàn).');

  // Check Account B cannot read A's draft
  const peekDraft = await req(`/drafts/${draftIdA}`, { headers: { Authorization: `Bearer ${tokenB}` } });
  if (peekDraft.status === 404) {
    console.log('  ✓ Tài khoản B cố xem draft của A -> Bị từ chối (HTTP 404):', peekDraft.data.error);
  } else {
    throw new Error('LỖI BẢO MẬT: Tài khoản B đọc được draft của A!');
  }

  // Check Account B cannot delete A's draft
  const delDraft = await req(`/drafts/${draftIdA}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenB}` }
  });
  if (delDraft.status === 404) {
    console.log('  ✓ Tài khoản B cố xóa draft của A -> Bị từ chối (HTTP 404):', delDraft.data.error);
  } else {
    throw new Error('LỖI BẢO MẬT: Tài khoản B xóa được draft của A!');
  }

  // TEST 4: Concurrency limit (Max 1 concurrent task)
  console.log('\n[TEST 4] Kiểm tra Giới hạn tác vụ đồng thời (Tối đa 1 tác vụ)...');
  const job1 = await req('/ai/jobs', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({
      costumeId: 'cos-nhat-binh',
      costumeName: 'Áo Nhật Bình',
      remixStyle: 'traditional',
      sketchDataUrl: 'data:image/png;base64,sketch1'
    })
  });
  if (job1.status !== 201) throw new Error('Tạo job 1 thất bại: ' + JSON.stringify(job1.data));
  console.log('  ✓ Tài khoản A tạo tác vụ AI 1 thành công (ID:', job1.data.data.id, ')');

  // Immediately try to start a second concurrent job from Account A
  const job2Concurrent = await req('/ai/jobs', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({
      costumeId: 'cos-tac',
      costumeName: 'Áo Tấc',
      remixStyle: 'subtle_modern',
      sketchDataUrl: 'data:image/png;base64,sketch2'
    })
  });
  if (job2Concurrent.status === 409) {
    console.log('  ✓ Chặn đa luồng thành công (HTTP 409):', job2Concurrent.data.error);
  } else {
    throw new Error('Lỗi: Hệ thống cho phép chạy song song 2 tác vụ cùng lúc! Status: ' + job2Concurrent.status);
  }

  // Wait for background worker to complete Job 1
  console.log('  Đang chờ tác vụ 1 hoàn thành qua OpenAI / Compositor...');
  const completedJob1 = await waitForJob(job1.data.data.id, tokenA, 45);
  console.log('  ✓ Tác vụ 1 đã hoàn thành! Result Image:', completedJob1.resultImageUrl?.substring(0, 40) + '...');

  // TEST 5: Daily Limit (Max 5/day per account)
  console.log('\n[TEST 5] Kiểm tra Hạn mức AI 5 lượt/ngày...');
  console.log('  Tài khoản A đã dùng 1/5 lượt.');

  // For fast testing of quota limit without waiting minutes on internet image generations,
  // we can create remaining 4 jobs sequentially
  for (let num = 2; num <= 5; num++) {
    const jobRes = await req('/ai/jobs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({
        costumeId: 'cos-nhat-binh',
        costumeName: 'Áo Nhật Bình ' + num,
        remixStyle: 'traditional',
        sketchDataUrl: 'data:image/png;base64,sketch' + num
      })
    });
    if (jobRes.status !== 201) throw new Error(`Tạo tác vụ ${num} thất bại: ` + JSON.stringify(jobRes.data));
    console.log(`  ✓ Tác vụ ${num}/5 tiếp nhận thành công (ID: ${jobRes.data.data.id})`);

    // Wait for it to complete before next
    await waitForJob(jobRes.data.data.id, tokenA, 45);
  }

  // Check quota usage
  const quotaA = await req('/ai/jobs/usage', { headers: { Authorization: `Bearer ${tokenA}` } });
  console.log(`  ✓ Tài khoản A đã dùng: ${quotaA.data.data.usage}/${quotaA.data.data.max} lượt hôm nay.`);

  // Attempt Job 6 -> Must be REJECTED with 429
  const job6 = await req('/ai/jobs', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({
      costumeId: 'cos-nhat-binh',
      costumeName: 'Áo Nhật Bình 6',
      remixStyle: 'traditional',
      sketchDataUrl: 'data:image/png;base64,sketch6'
    })
  });
  if (job6.status === 429) {
    console.log('  ✓ Chặn vượt hạn mức ngày thành công (HTTP 429):', job6.data.error);
  } else {
    throw new Error('Lỗi: Hệ thống cho phép vượt quá 5 lượt/ngày! Status: ' + job6.status);
  }

  // Attempt retry when quota is exhausted -> Must also be REJECTED with 429
  const retryExhausted = await req(`/ai/jobs/${job1.data.data.id}/retry`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` }
  });
  if (retryExhausted.status === 429) {
    console.log('  ✓ Thử lại (retry) khi hết hạn mức cũng bị chặn đúng quy định (HTTP 429):', retryExhausted.data.error);
  } else {
    throw new Error('Lỗi: Retry không bị áp dụng hạn mức 5/ngày!');
  }

  // Account B still has quota 0/5
  const quotaB = await req('/ai/jobs/usage', { headers: { Authorization: `Bearer ${tokenB}` } });
  console.log(`  ✓ Tài khoản B kiểm tra quota: ${quotaB.data.data.usage}/${quotaB.data.data.max} lượt (hoàn toàn độc lập).`);

  // TEST 6: Session Revocation & Logout
  console.log('\n[TEST 6] Kiểm tra Thu hồi phiên & Đăng xuất...');
  const logoutRes = await req('/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` }
  });
  console.log('  ✓ Đăng xuất thành công:', logoutRes.data.message);

  const meAfterLogout = await req('/auth/me', { headers: { Authorization: `Bearer ${tokenA}` } });
  if (meAfterLogout.status === 401) {
    console.log('  ✓ Token cũ của A bị từ chối ngay lập tức (HTTP 401):', meAfterLogout.data.error);
  } else {
    throw new Error('Lỗi: Token chưa bị thu hồi sau khi logout!');
  }

  // TEST 7: Forgot Password Security (Strictly no reset by email alone)
  console.log('\n[TEST 7] Kiểm tra Bảo mật Quên mật khẩu (Không cho phép đổi chỉ bằng email)...');
  // Attempt 1: Only email -> MUST BE REJECTED (HTTP 400)
  const forgotEmailOnly = await req('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email: userB.email })
  });
  if (forgotEmailOnly.status === 400) {
    console.log('  ✓ Chặn yêu cầu đổi mật khẩu chỉ bằng email (HTTP 400):', forgotEmailOnly.data.error);
  } else {
    throw new Error('LỖI BẢO MẬT: Hệ thống cho phép yêu cầu đổi mật khẩu chỉ bằng email!');
  }

  // Attempt 2: Email with WRONG recovery code -> MUST BE REJECTED (HTTP 401)
  const forgotWrongCode = await req('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email: userB.email, recoveryCode: 'REC-000000' })
  });
  if (forgotWrongCode.status === 401) {
    console.log('  ✓ Chặn mã khôi phục sai (HTTP 401):', forgotWrongCode.data.error);
  } else {
    throw new Error('LỖI BẢO MẬT: Cho phép đổi mật khẩu với mã khôi phục không hợp lệ!');
  }

  // Attempt 3: Email with CORRECT recovery code -> SUCCESS
  const forgotCorrect = await req('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email: userB.email, recoveryCode: userB.recoveryCode })
  });
  if (forgotCorrect.status === 200 && forgotCorrect.data.resetToken) {
    console.log('  ✓ Xác thực thành công khi có đúng mã khôi phục cá nhân.');
    // Complete reset
    const doReset = await req('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ resetToken: forgotCorrect.data.resetToken, newPassword: 'newpassword456' })
    });
    if (doReset.status !== 200) throw new Error('Đặt lại mật khẩu thất bại: ' + doReset.data.error);
    console.log('  ✓ Đặt lại mật khẩu thành công bằng mã xác thực hợp lệ.');

    // Login with new password
    const loginNew = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: userB.email, password: 'newpassword456' })
    });
    if (loginNew.status !== 200) throw new Error('Đăng nhập bằng mật khẩu mới thất bại!');
    console.log('  ✓ Đăng nhập thành công với mật khẩu mới.');
  } else {
    throw new Error('Khôi phục mật khẩu hợp lệ thất bại: ' + JSON.stringify(forgotCorrect.data));
  }

  // TEST 8: Protected Image Access (No public access to user's private creations)
  console.log('\n[TEST 8] Kiểm tra Bảo mật Hình ảnh (Ảnh riêng tư không công khai)...');
  // 1. Cultural reference image: MUST be public
  const publicCostumeRes = await fetch('http://localhost:3000/assets/costumes/ao-nhat-binh-nam-phuong.jpg');
  if (publicCostumeRes.ok) {
    console.log('  ✓ Ảnh cổ phục công khai (bảo tàng) truy cập được bình thường (HTTP 200).');
  } else {
    throw new Error('Ảnh cổ phục công khai bị lỗi truy cập!');
  }

  // 2. Private result image from Account A
  if (completedJob1.resultImageUrl && completedJob1.resultImageUrl.startsWith('/assets/results/')) {
    const filename = completedJob1.resultImageUrl.split('/').pop();

    // Guest without token -> MUST BE 401
    const anonImg = await fetch(`http://localhost:3000/assets/results/${filename}`);
    if (anonImg.status === 401) {
      console.log('  ✓ Khách ẩn danh truy cập ảnh riêng tư -> Bị từ chối (HTTP 401).');
    } else {
      throw new Error('LỖI BẢO MẬT: Ảnh AI của người dùng đang bị công khai! Status: ' + anonImg.status);
    }

    // Account B with token -> MUST BE 403 (Wardrobe isolation)
    const otherUserImg = await fetch(`http://localhost:3000/assets/results/${filename}?token=${tokenB}`);
    if (otherUserImg.status === 403) {
      console.log('  ✓ Tài khoản B truy cập ảnh riêng tư của A -> Bị từ chối (HTTP 403).');
    } else {
      throw new Error('LỖI BẢO MẬT: Tài khoản B xem được ảnh kết quả của Tài khoản A!');
    }

    // Owner (Account A) -> MUST BE 200
    // (Re-login A to get active token)
    const loginA = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: emailA, password: 'password123' })
    });
    const freshTokenA = loginA.data.data.token;
    const ownerImg = await fetch(`http://localhost:3000/assets/results/${filename}?token=${freshTokenA}`);
    if (ownerImg.status === 200) {
      console.log('  ✓ Chủ sở hữu (Tài khoản A) truy cập ảnh của mình thành công (HTTP 200).');
    } else {
      throw new Error('Chủ sở hữu không xem được ảnh của mình! Status: ' + ownerImg.status);
    }
  }

  // TEST 9: Concurrency Lock Bypass Prevention (Cannot delete running job to bypass limit)
  console.log('\n[TEST 9] Kiểm tra Chống gian lận: Xóa job để vượt giới hạn đồng thời...');
  // Account B creates an active AI job
  const jobActiveB = await req('/ai/jobs', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenB}` },
    body: JSON.stringify({
      costumeId: 'cos-tac',
      costumeName: 'Áo Tấc Hoàng Gia',
      remixStyle: 'traditional',
      sketchDataUrl: 'data:image/png;base64,sketchB'
    })
  });
  if (jobActiveB.status !== 201) throw new Error('Tạo job cho B thất bại: ' + JSON.stringify(jobActiveB.data));
  const activeJobIdB = jobActiveB.data.data.id;
  console.log('  ✓ B đã tạo tác vụ AI đang thực hiện (ID:', activeJobIdB, ')');

  // Attempt to DELETE the running job to reset active count -> MUST BE REJECTED with 409
  const deleteRunningJob = await req(`/ai/jobs/${activeJobIdB}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenB}` }
  });
  if (deleteRunningJob.status === 409) {
    console.log('  ✓ Chặn xóa tác vụ đang chạy thành công (HTTP 409):', deleteRunningJob.data.error);
  } else {
    throw new Error('LỖI BẢO MẬT: Hệ thống cho phép xóa tác vụ đang chạy để lách đa luồng! Status: ' + deleteRunningJob.status);
  }

  // And second concurrent job still blocked
  const concurrentB = await req('/ai/jobs', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenB}` },
    body: JSON.stringify({
      costumeId: 'cos-giao-linh',
      costumeName: 'Áo Giao Lĩnh',
      sketchDataUrl: 'data:image/png;base64,sketchB2'
    })
  });
  if (concurrentB.status === 409) {
    console.log('  ✓ Khóa đa luồng được bảo toàn 100%, không bị lách qua việc xóa job.');
  } else {
    throw new Error('LỖI: Khóa đa luồng bị phá vỡ!');
  }

  // Wait for B's job to complete
  await waitForJob(activeJobIdB, tokenB, 45);

  // TEST 10: Real Backup & Genuine Database Restoration
  console.log('\n[TEST 10] Kiểm tra THẬT việc Khôi phục Bản sao lưu (Real Backup & Restore)...');
  // 1. Create a sentinel draft for Account B
  const sentinelDraft = await req('/drafts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenB}` },
    body: JSON.stringify({
      costumeId: 'cos-nhat-binh',
      title: 'BẢN PHỐI MẪU KIỂM TRA SAO LƯU THỰC TẾ',
      selectedColorId: 'col-nb-yellow',
      sketchDataUrl: 'data:image/png;base64,sentinel'
    })
  });
  if (sentinelDraft.status !== 200) throw new Error('Tạo bản phối mẫu thất bại!');
  const sentinelId = sentinelDraft.data.data.id;
  console.log('  ✓ Đã ghi nhận bản phối mốc:', sentinelId);

  // 2. Perform fresh backup snapshot
  const backupTrigger = await req('/system/durability-status');
  const backupPath = backupTrigger.data.data.latestBackupPath;
  const backupFilename = backupPath.split('/').pop();
  console.log('  ✓ Đã tạo snapshot sao lưu:', backupFilename);

  // 3. Delete the sentinel draft to simulate data loss or corrupt change
  const deleteRes = await req(`/drafts/${sentinelId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenB}` }
  });
  if (deleteRes.status !== 200) throw new Error('Xóa bản phối mốc thất bại!');

  // Verify it is genuinely gone
  const checkGone = await req(`/drafts/${sentinelId}`, { headers: { Authorization: `Bearer ${tokenB}` } });
  if (checkGone.status !== 404) throw new Error('Bản phối chưa bị xóa!');
  console.log('  ✓ Đã xóa bản phối mốc (xác nhận trạng thái 404 Not Found).');

  // 4. RESTORE DATABASE FROM BACKUP SNAPSHOT
  console.log('  Thực hiện khôi phục thật cơ sở dữ liệu từ snapshot:', backupFilename);
  const restoreRes = await req('/system/restore', {
    method: 'POST',
    body: JSON.stringify({ backupFilename })
  });
  if (restoreRes.status !== 200 || !restoreRes.data.success) {
    throw new Error('Khôi phục cơ sở dữ liệu thất bại: ' + JSON.stringify(restoreRes.data));
  }
  console.log('  ✓ API Khôi phục thành công:', restoreRes.data.message);
  console.log('    Chi tiết phục hồi:', JSON.stringify(restoreRes.data.data));

  // 5. GENUINELY VERIFY THE RESTORED RECORD IN DATABASE
  const checkRestored = await req(`/drafts/${sentinelId}`, { headers: { Authorization: `Bearer ${tokenB}` } });
  if (checkRestored.status === 200 && checkRestored.data.data.id === sentinelId) {
    console.log('  ✓ KIỂM CHỨNG THẬT THÀNH CÔNG: Bản phối mốc đã được khôi phục nguyên vẹn 100% trong SQLite!');
    console.log('    Tiêu đề khôi phục:', checkRestored.data.data.title);
  } else {
    throw new Error('THẤT BẠI: Bản phối mốc không xuất hiện lại sau khi khôi phục!');
  }

  console.log('\n=== TẤT CẢ 10 BÀI TEST CHUYÊN SÂU ĐÃ VƯỢT QUA 100% THÀNH CÔNG! ===');
}

runTests().catch((err) => {
  console.error('\n❌ KIỂM TRA THẤT BẠI:', err.message);
  process.exit(1);
});
