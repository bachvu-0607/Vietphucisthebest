import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export function SystemMonitor() {
  const [data,setData]=useState<any>(null);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  useEffect(()=>{
    let stopped=false, loading=false;
    const load=async()=>{
      if(loading || document.hidden) return;
      loading=true;if(!stopped)setBusy(true);
      try {const result=await api.getSystemMonitor();if(!stopped){setData(result);setError('');}}
      catch {if(!stopped)setError('Không đọc được hệ thống. Số liệu cũ có thể không còn chính xác. Kiểm tra Railway Logs.');}
      finally {loading=false;if(!stopped)setBusy(false);}
    };
    void load();const timer=setInterval(load,60000);
    document.addEventListener('visibilitychange',load);
    return()=>{stopped=true;clearInterval(timer);document.removeEventListener('visibilitychange',load);};
  },[]);
  const counts=data?.last24h;
  const messages:Record<string,string>={server_started:'Máy chủ khởi động',ai_completed:'AI hoàn tất',ai_failed:'AI thất bại',ai_interrupted:'AI bị gián đoạn khi khởi động lại',ai_provider_attempt:'Gọi dịch vụ AI',ai_provider_error:'Dịch vụ AI trả lỗi',ai_provider_limit:'Dịch vụ AI giới hạn lượt',ai_result_save_failed:'Không lưu được kết quả AI',backup_failed:'Backup thất bại',http_server_error:'Yêu cầu gặp lỗi máy chủ',chat_completed:'Trợ lý đã trả lời',chat_rate_limited:'Gemini giới hạn lượt trợ lý',chat_timeout:'Trợ lý quá thời gian',chat_upstream:'Gemini lỗi phía máy chủ',chat_bad_request:'Trợ lý gọi sai model hoặc yêu cầu',chat_credentials:'Khóa Gemini không hợp lệ',chat_unknown:'Trợ lý gặp lỗi'};
  return <section className="rounded-2xl border border-pink-200 bg-white p-5 space-y-4">
    <h2 className="text-xl font-semibold">Theo dõi hệ thống · Quản trị viên</h2>
    <p className="text-sm text-gray-600">Tự cập nhật mỗi phút khi trang đang mở. Thống kê kết quả giữ 7 ngày, bắt đầu từ khi bật giám sát.</p>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {!data && <p>{busy?'Đang tải…':'Chưa có số liệu.'}</p>}
    {data && <>
      <p className="text-xs text-gray-500">Kiểm tra lúc {new Date(data.checkedAt).toLocaleString('vi-VN')} · Máy chủ chạy {Math.floor(data.uptimeSeconds/60)} phút</p>
      {!data.available && <p role="alert" className="text-red-700">Bộ lưu thống kê gặp lỗi; số liệu có thể thiếu.</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Lượt AI hôm nay',`${data.ai.dailyUsage} / ${data.ai.dailyLimit}`],
          ['Đang chờ / xử lý',data.ai.active],['Hoàn tất · 24 giờ',counts.completed],['Thất bại · 24 giờ',counts.failed],
          ['Gián đoạn · 24 giờ',counts.interrupted],['Lỗi máy chủ · 24 giờ',counts.errors],['Bị giới hạn · 24 giờ',counts.limited],
          ['Thời gian AI thành công',counts.completed?`${Math.round(counts.durationMs/counts.completed/1000)} giây`:'Chưa có'],
          ['Lần gọi OpenAI · 24 giờ',counts.openaiCalls],['Lần gọi Google · 24 giờ',counts.googleCalls],
        ].map(([label,value])=><div key={label} className="rounded-lg bg-pink-50 p-3"><div className="text-xs text-gray-600">{label}</div><strong>{value}</strong></div>)}
      </div>
      <p className="text-sm">Hạn mức ngày dùng cùng mốc ngày với backend. Lượt gọi dịch vụ có thể nhiều hơn lượt AI do thử model dự phòng; không phải số tiền đã chi.</p>
      <p className="text-sm">Ổ đĩa: {data.disk?`${data.disk.usedPercent}% đã dùng, còn ${(data.disk.free/1073741824).toFixed(2)} GB (theo filesystem)`:'Chưa đo được'}. Backup database gần nhất: {data.lastBackup?new Date(data.lastBackup).toLocaleString('vi-VN'):'Chưa thấy'}.</p>
      <p className="text-xs text-gray-500">Chỉ số filesystem có thể khác hạn mức Volume Railway. Backup database không bao gồm ảnh và không chứng minh khả năng khôi phục.</p>
      <div role="status">{data.alerts.length?data.alerts.map((a:any)=><p className="text-red-700" key={a.code}>⚠ {a.message}</p>):<p className="text-green-700">Chưa có cảnh báo theo các ngưỡng đang theo dõi.</p>}</div>
      <details><summary className="cursor-pointer">Nhật ký gần nhất (tối đa 50 dòng)</summary>
        <p className="text-xs text-gray-500">Sự kiện trùng được gộp/giảm lặp trong 1 phút. Dùng thống kê phía trên để xem tổng số lượt.</p>
        <div className="max-h-72 overflow-auto"><table className="w-full text-sm"><thead><tr><th className="text-left">Thời gian</th><th className="text-left">Mức</th><th className="text-left">Sự kiện</th></tr></thead><tbody>{data.events.map((e:any,i:number)=><tr key={i}><td>{new Date(e.time).toLocaleString('vi-VN')}</td><td>{e.level}</td><td>{messages[e.code]||e.code}</td></tr>)}</tbody></table></div>
      </details>
      <p className="text-xs text-gray-500">Cảnh báo ở đây và Railway Logs. Máy chủ tắt hẳn cần giám sát bên ngoài tại /healthz; chưa có thông báo email tự động.</p>
    </>}
  </section>;
}
