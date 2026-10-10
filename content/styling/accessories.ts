import type { Costume } from '../../shared/types.ts';

// Legacy strings are persistent selection keys. Never rename them during editing.
export interface AccessoryCategoryGroup {
    id: string;
    name: string;
    items: string[];
  }

  // Danh mục phụ kiện phân theo 5 bộ phận cơ thể trong mẫu phối (Cúc áo / Kim bội đưa vào tùy chọn có thể mặc hoặc không)
  const getLegacyStyleAccessoryCategories = (
    style: 'traditional' | 'subtle_modern' | 'remix_fusion'
  ): AccessoryCategoryGroup[] => {
    if (style === 'subtle_modern') {
      return [
        {
          id: 'head',
          name: 'Đầu và tóc',
          items: ['Khăn vành sa lụa trắng ngà', 'Trâm bạc cài hoa sen cẩn ngọc', 'Băng đô lụa tơ tằm thêu tay']
        },
        {
          id: 'face_ears',
          name: 'Mắt và tai',
          items: ['Khuyên tai ngọc trai rơi', 'Kính gọng vàng thanh lịch']
        },
        {
          id: 'neck_chest',
          name: 'Cổ và ngực (Trang sức & Cúc áo)',
          items: [
            'Cúc cài kim bội dải thao đỏ',
            'Khuy xà cừ / Cúc ngọc trang nhã',
            'Chuỗi ngọc trai hoàng gia nhiều vòng',
            'Kiềng bạc trơn tối giản',
            'Khăn lụa tơ tằm quàng cổ'
          ]
        },
        {
          id: 'hands_waist',
          name: 'Tay và thắt lưng',
          items: [
            'Quạt đoàn phiến lụa tơ thêu mẫu đơn đính ngọc',
            'Dù lụa hoa sen che nắng',
            'Túi mây đan tre thủ công',
            'Đồng hồ dây da phong cách cổ điển'
          ]
        },
        {
          id: 'feet_shoes',
          name: 'Chân và hài',
          items: ['Giày cao gót quai lụa cách tân', 'Guốc mộc quai nhung đỏ']
        }
      ];
    }

    if (style === 'remix_fusion') {
      return [
        {
          id: 'head',
          name: 'Đầu và tóc',
          items: ['Tóc tết bím lệch cài hoa ngọc đào', 'Mũ beret dạ cổ điển']
        },
        {
          id: 'face_ears',
          name: 'Mắt và tai',
          items: ['Khuyên tai ngọc trai rơi', 'Kính râm mắt mèo retro', 'Tai nghe headphone retro']
        },
        {
          id: 'neck_chest',
          name: 'Cổ và ngực (Trang sức & Cúc áo)',
          items: [
            'Cúc cài kim bội dải thao đỏ',
            'Khuy kim loại đúc phá cách',
            'Vòng choker kim loại bản to',
            'Chuỗi ngọc trai tự nhiên'
          ]
        },
        {
          id: 'hands_waist',
          name: 'Tay và thắt lưng',
          items: [
            'Túi tote vải canvas streetwear',
            'Túi đeo chéo mini da bóng',
            'Vòng tay kim loại dạng xích',
            'Thắt lưng da bản rộng khóa kim loại'
          ]
        },
        {
          id: 'feet_shoes',
          name: 'Chân và giày',
          items: ['Boot da cổ lửng', 'Giày thể thao trắng']
        }
      ];
    }

    // traditional: Gợi ý phối truyền thống (Cúc kim bội dải thao là phụ kiện tùy chọn linh hoạt)
    return [
      {
        id: 'head',
        name: 'Đầu và tóc',
        items: [
          'Khăn vành dây xanh lam thẫm',
          'Trâm bạc cài hoa sen cẩn ngọc'
        ]
      },
      {
        id: 'face_ears',
        name: 'Mắt và tai',
        items: ['Khuyên tai ngọc trai rơi']
      },
      {
        id: 'neck_chest',
        name: 'Cổ và ngực (Trang sức & Cúc áo)',
        items: [
          'Cúc cài kim bội dải thao đỏ (Ấn bội cổ truyền)',
          'Hàng cúc ngọc / khuy xà cừ cổ phong',
          'Kiềng bạc chạm hoa mai',
          'Chuỗi ngọc trai tự nhiên'
        ]
      },
      {
        id: 'hands_waist',
        name: 'Tay và thắt lưng',
        items: [
          'Quạt đoàn phiến lụa tơ thêu mẫu đơn đính ngọc',
          'Quạt xếp nan ngà chạm lộng thếp vàng',
          'Búp sen bách diệp hồng tươi'
        ]
      },
      {
        id: 'feet_shoes',
        name: 'Chân và hài',
        items: [
          'Hài thêu hoa sen mũi nhọn',
          'Guốc mộc quai nhung đỏ'
        ]
      }
    ];
  };

  export const getStyleAccessories = (style: 'traditional' | 'subtle_modern' | 'remix_fusion') => {
    const cats = getLegacyStyleAccessoryCategories(style);
    return cats.flatMap((cat) => cat.items);
  };

  const getLegacyDefaultAccessoriesForStyle = (style: 'traditional' | 'subtle_modern' | 'remix_fusion') => {
    if (style === 'subtle_modern') {
      return ['Khăn vành sa lụa trắng ngà', 'Chuỗi ngọc trai hoàng gia nhiều vòng'];
    }
    if (style === 'remix_fusion') {
      return ['Tóc tết bím lệch cài hoa ngọc đào', 'Khuyên tai ngọc trai rơi'];
    }
    // traditional: Mặc định đội Khăn vành dây; Cúc áo / Kim bội dải thao là tùy chọn người dùng có thể mặc hoặc không
    return ['Khăn vành dây xanh lam thẫm'];
  };


export function getStyleAccessoryCategories(style: 'traditional' | 'subtle_modern' | 'remix_fusion', costume?: Costume): AccessoryCategoryGroup[] {
  const groups = getLegacyStyleAccessoryCategories(style);
  if (style !== 'traditional' || !costume) return groups;
  const categoryGroup = { headwear: 'head', jewelry: 'neck_chest', handheld: 'hands_waist', waist: 'hands_waist', footwear: 'feet_shoes' };
  return groups.map(group => ({
    ...group,
    items: [...new Set([
      ...costume.accessories.filter(item => categoryGroup[item.category] === group.id).map(item => item.name),
      ...group.items,
    ])],
  }));
}

export function getDefaultAccessoriesForStyle(style: 'traditional' | 'subtle_modern' | 'remix_fusion', costume?: Costume): string[] {
  if (style !== 'traditional' || !costume) return getLegacyDefaultAccessoriesForStyle(style);
  // Choose an optional headpiece from this garment instead of using Nhật Bình's khăn for every garment.
  return costume.accessories.filter(item => item.category === 'headwear' && item.isRecommended).slice(0, 1).map(item => item.name);
}

export function getAccessoryDisplayLabel(selection: string): string {
  return selection.replace('nan ngà chạm', 'nan màu ngà chạm');
}
