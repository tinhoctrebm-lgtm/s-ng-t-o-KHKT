import { Place, NewsItem, User, DashboardStats } from '../types/index.ts';

export const initialPlaces: Place[] = [
  {
    id: 'ao-ba-om',
    name: 'Danh thắng Ao Bà Om',
    slug: 'ao-ba-om',
    category: 'tam-linh',
    district: 'Khu vực giáp ranh Vĩnh Long - Trà Vinh',
    address: 'Khóm 3, Phường 8, Tuyến du lịch di sản Tây Nam Bộ',
    coordinates: {
      lat: 9.9518,
      lng: 106.3156,
    },
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        caption: 'Mặt nước phẳng lặng của Ao Bà Om soi bóng hàng cổ thụ'
      },
      {
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
        caption: 'Bộ rễ cây sao dầu cổ thụ trồi lên mặt đất với hình thù kỳ thú'
      },
      {
        url: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
        caption: 'Không gian tĩnh mịch ngập tràn cây xanh hàng trăm năm tuổi'
      }
    ],
    shortDesc: 'Danh thắng lịch sử văn hóa với hồ nước ngọt xanh biếc hình chữ nhật được bao bọc bởi hơn 500 cây sao, dầu cổ thụ trăm tuổi.',
    overview: 'Ao Bà Om (còn gọi là Ao Vuông) là một trong những thắng cảnh độc đáo bậc nhất ở vùng đồng bằng sông Cửu Long. Hồ nước ngọt có hình chữ nhật dài khoảng 500m, rộng khoảng 300m. Xung quanh ao là những bờ cát cao thoai thoải với rừng cây cổ thụ sao, dầu nguyên sinh rợp bóng mát.',
    history: 'Theo truyền tích dân gian xưa kia để giải quyết cuộc thi tài đào hồ lấy nước ngọt chống hạn hán và định đoạt quyền chọn dâu rể giữa nam và nữ, bà Om (vị trưởng nhóm nữ) đã dùng trí thông minh thắp đèn lồng lừa đàn ông tưởng trời đã sáng mà nghỉ sớm, từ đó bên nữ giành chiến thắng và hồ nước mang tên Ao Bà Om.',
    culturalValue: 'Ao Bà Om không chỉ là danh lam thắng cảnh cấp quốc gia mà còn là trung tâm sinh hoạt văn hóa, lễ hội cộng đồng như Lễ hội Ok Om Bok (lễ cúng trăng) truyền thống, nơi giao thoa tình đoàn kết gắn bó của đồng bào các dân tộc anh em.',
    experiences: 'Dạo mát dưới những gốc cây sao cổ thụ có bộ rễ uốn lượn kỳ lạ, thưởng thức nước dừa sáp ngọt béo, tham quan quần thể chùa Âng và Bảo tàng Văn hóa Khmer liền kề.',
    suitableTime: 'Quanh năm, đặc biệt vào rằm tháng 10 âm lịch khi diễn ra Lễ hội Ok Om Bok rực rỡ sắc màu.',
    audioVietnamese: {
      text: 'Chào mừng quý khách đến với Danh thắng Ao Bà Om, một viên ngọc xanh rạng rỡ của vùng đồng bằng sông nước Cửu Long. Mặt hồ phẳng lặng hình chữ nhật rộng lớn như một tấm gương khổng lồ soi bóng hàng trăm cây cổ thụ sao dầu có tuổi đời hàng thế kỷ. Những bộ rễ cây kỳ vĩ trồi lên khỏi mặt đất tạo nên những hình thù nghệ thuật độc đáo của thiên nhiên. Nơi đây gắn liền với câu chuyện trí tuệ dân gian về tinh thần lao động bền bỉ, và là trung tâm tổ chức lễ hội cúng trăng Ok Om Bok linh thiêng.',
      durationEstimate: '1 phút 40 giây'
    },
    audioEnglish: {
      text: 'Welcome to Ba Om Pond, a renowned cultural and natural attraction in the Southwestern region of the Mekong Delta. The tranquil square pond is embraced by centuries-old dipterocarp trees featuring mesmerizing protruding root systems. It is also the spiritual center of the sacred Ok Om Bok festival.',
      durationEstimate: '1 minute 20 seconds'
    },
    views: 3520,
    likes: 428,
    featured: true,
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z'
  },
  {
    id: 'den-tho-pham-hung',
    name: 'Khu tưởng niệm Chủ tịch Hội đồng Bộ trưởng Phạm Hùng',
    slug: 'den-tho-pham-hung',
    category: 'lich-su-van-hoa',
    district: 'Huyện Long Hồ, Tỉnh Vĩnh Long',
    address: 'Ấp Long Thuận A, Xã Long Phước, Huyện Long Hồ, Tỉnh Vĩnh Long',
    coordinates: {
      lat: 10.2241,
      lng: 105.9925,
    },
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
        caption: 'Cổng vào trang nghiêm của Khu tưởng niệm đồng chí Phạm Hùng'
      },
      {
        url: 'https://images.unsplash.com/photo-1590059390046-512fb449679a?auto=format&fit=crop&w=1200&q=80',
        caption: 'Gian thờ chính và nhà trưng bày tư liệu, hiện vật lịch sử'
      },
      {
        url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
        caption: 'Khuôn viên công viên cây xanh râm mát bên bờ sông êm đềm'
      }
    ],
    shortDesc: 'Di tích lịch sử cấp quốc gia tri ân nhà lãnh đạo kiệt xuất của cách mạng Việt Nam, người con kiên trung của quê hương Vĩnh Long.',
    overview: 'Khu tưởng niệm đồng chí Phạm Hùng rộng 3,2 ha, được xây dựng theo lối kiến trúc truyền thống Nam Bộ thoáng đãng, hài hòa với thiên nhiên. Quần thể gồm nhà tưởng niệm, nhà trưng bày tư liệu hiện vật về cuộc đời hoạt động cách mạng của Bác Hai Phạm Hùng, nhà chiếu phim tư liệu và khu tái hiện nhà làm việc thời kháng chiến.',
    history: 'Đồng chí Phạm Hùng sinh ngày 11/6/1912 tại xã Long Phước, Vĩnh Long. Đồng chí từng giữ các trọng trách: Ủy viên Bộ Chính trị, Phó Chủ tịch Hội đồng Bộ trưởng kiêm Bộ trưởng Bộ Nội vụ, Chủ tịch Hội đồng Bộ trưởng nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.',
    culturalValue: 'Địa chỉ đỏ giáo dục truyền thống yêu nước, lý tưởng cách mạng cho các thế hệ học sinh, sinh viên và thanh niên; điểm tham quan du lịch nguồn cội trang trọng của tỉnh Vĩnh Long.',
    experiences: 'Dâng hương tưởng niệm, nghe thuyết minh về tấm gương người cộng sản kiên cường, xem phim tư liệu, tham quan phòng trưng bày hơn 500 hiện vật lịch sử quý báu.',
    suitableTime: 'Từ 7h30 đến 17h00 các ngày trong tuần. Lý tưởng nhất vào các dịp lễ kỷ niệm 30/4, sinh nhật Bác Hai Phạm Hùng (11/6).',
    audioVietnamese: {
      text: 'Kính chào quý khách đang có mặt tại Khu tưởng niệm Chủ tịch Hội đồng Bộ trưởng Phạm Hùng, tọa lạc tại xã Long Phước, huyện Long Hồ, quê hương Vĩnh Long anh hùng. Đồng chí Phạm Hùng, người con ưu tú của đất phương Nam, là nhà lãnh đạo tiền bối kiệt xuất của Đảng và Nhà nước ta. Trong suốt cuộc đời hoạt động cách mạng vẻ vang, đồng chí đã nêu cao phẩm chất của người chiến sĩ cộng sản bất khuất, tận tụy vì độc lập tự do của Tổ quốc và hạnh phúc của Nhân dân.',
      durationEstimate: '1 phút 50 giây'
    },
    audioEnglish: {
      text: 'Welcome to the Memorial Site of Chairman of the Council of Ministers Pham Hung, located in Long Phuoc commune, Long Ho district, Vinh Long province. This national historic site honors one of the most prominent revolutionary leaders of Vietnam who dedicated his whole life to the nation.',
      durationEstimate: '1 minute 25 seconds'
    },
    views: 4890,
    likes: 615,
    featured: true,
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-02-28T09:00:00.000Z'
  },
  {
    id: 'chua-ang',
    name: 'Chùa Âng (Wat Angkor Borey)',
    slug: 'chua-ang',
    category: 'tam-linh',
    district: 'Khu vực văn hóa Tây Nam Bộ liền kề',
    address: 'Phường 8, Quần thể danh thắng di sản văn hóa Khmer',
    coordinates: {
      lat: 9.9525,
      lng: 106.3168,
    },
    coverImage: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
        caption: 'Kiến trúc tháp mái cong vút đặc trưng của Chùa Âng'
      },
      {
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
        caption: 'Họa tiết điêu khắc tinh xảo thần Reahu và tiên nữ Kinnari'
      }
    ],
    shortDesc: 'Ngôi chùa cổ kính hơn 1.000 năm lịch sử, kiệt tác kiến trúc Phật giáo Nam tông Khmer mang đậm dấu ấn Angkor cổ xưa.',
    overview: 'Chùa Âng có tên đầy đủ là Wat Angkor Borey, là ngôi chùa cổ kính tiêu biểu bậc nhất trong hệ thống các ngôi chùa Khmer Tây Nam Bộ. Ngôi chùa ngự giữa rừng cây cổ thụ, tạo nên không khí trang nghiêm thanh tịnh.',
    history: 'Được khởi dựng từ khoảng thế kỷ thứ 10 và trải qua nhiều lần trùng tu, Chùa Âng lưu giữ nguyên vẹn giá trị kiến trúc nghệ thuật cung đình Angkor phối hợp hài hòa với văn hóa Phật giáo Nam tông.',
    culturalValue: 'Di tích Lịch sử - Văn hóa cấp Quốc gia, biểu tượng thiêng liêng của đời sống tâm linh, tín ngưỡng và văn hóa thẩm mỹ của đồng bào Khmer.',
    experiences: 'Chiêm bái đức Phật Thích Ca trong chánh điện trang nghiêm, chiêm ngưỡng các bức bích họa kể về cuộc đời đức Phật, chụp ảnh kỷ niệm dưới tán cây rừng râm mát.',
    suitableTime: 'Các mùa trong năm, đặc biệt trong các dịp Tết Chôl Chnăm Thmây và Lễ Sen Dolta.',
    audioVietnamese: {
      text: 'Chùa Âng, hay Wat Angkor Borey, là một trong những ngôi chùa cổ kính và tráng lệ nhất của đồng bào dân tộc Khmer. Ngôi chùa ẩn mình dưới những tán cây dầu, sao cổ thụ râm mát, toát lên vẻ thâm nghiêm và linh thiêng. Bước vào chánh điện, du khách sẽ ấn tượng với những hàng cột tròn vững chãi, những tác phẩm điêu khắc hình thần Reahu, chim thần Krud nâng đỡ mái chùa, cùng các bức bích họa tái hiện sinh động cuộc đời Đức Phật Thích Ca Mâu Ni.',
      durationEstimate: '1 phút 45 giây'
    },
    audioEnglish: {
      text: 'Wat Angkor Borey, famously known as Chua Ang, is one of the oldest and most splendid Khmer Theravada Buddhist pagodas in the Mekong Delta. Its architectural elegance reflects traditional Angkor motifs and vibrant murals depicting the life of Lord Buddha.',
      durationEstimate: '1 minute 15 seconds'
    },
    views: 2980,
    likes: 375,
    featured: false,
    createdAt: '2026-01-20T08:00:00.000Z',
    updatedAt: '2026-03-02T11:00:00.000Z'
  },
  {
    id: 'cu-lao-an-binh',
    name: 'Cù lao An Bình - Miệt vườn sinh thái',
    slug: 'cu-lao-an-binh',
    category: 'sinh-thai',
    district: 'Huyện Long Hồ, Tỉnh Vĩnh Long',
    address: 'Gồm 4 xã An Bình, Bình Hòa Phước, Hòa Ninh và Đồng Phú, Huyện Long Hồ, Vĩnh Long',
    coordinates: {
      lat: 10.2762,
      lng: 105.9868,
    },
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        caption: 'Kênh rạch rợp bóng cây xanh và vườn cây trĩu quả trên Cù lao An Bình'
      },
      {
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        caption: 'Trải nghiệm đi xuồng ba lá len lỏi giữa rừng dừa nước miệt vườn'
      },
      {
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
        caption: 'Vườn cây chôm chôm chín đỏ rực mời gọi du khách thập phương'
      }
    ],
    shortDesc: 'Trái tim xanh của du lịch sông nước Vĩnh Long với những miệt vườn cây trái trĩu quả, sông nước êm đềm và homestay đậm đà bản sắc Nam Bộ.',
    overview: 'Cù lao An Bình được bao bọc bởi dòng sông Tiền và sông Cổ Chiên, phù sa màu mỡ bồi đắp quanh năm tạo nên những vườn cây trái xum xuê trĩu quả: chôm chôm, sầu riêng, nhãn, bưởi Năm Roi, vú sữa.',
    history: 'Cù lao hình thành từ nhiều thế kỷ qua bởi sự lắng đọng phù sa của dòng Cửu Long. Người dân Vĩnh Long khai khẩn đất hoang, dựng nhà ven rạch, kiến tạo nên nếp sống miệt vườn thân thiện, phóng khoáng và mến khách.',
    culturalValue: 'Cái nôi của loại hình du lịch sinh thái homestay Nam Bộ đầu tiên tại Việt Nam, nơi du khách được sống chung với người bản địa, nghe đờn ca tài tử Nam Bộ - di sản văn hóa phi vật thể của nhân loại.',
    experiences: 'Đi thuyền qua sông Cổ Chiên, đạp xe đạp trên đường làng rợp bóng mát, hái trái cây ăn ngay tại vườn, chèo xuồng ba lá qua kênh rạch rợp bóng dừa nước, thưởng thức cá tai tượng chiên xù.',
    suitableTime: 'Từ tháng 5 đến tháng 9 dương lịch là mùa trái cây chín rộ phong phú nhất.',
    audioVietnamese: {
      text: 'Chào mừng quý khách đến với Cù lao An Bình, thủ phủ du lịch miệt vườn sinh thái nổi tiếng của tỉnh Vĩnh Long. Nằm giữa hai nhánh sông Tiền và sông Cổ Chiên, bốn xã cù lao như bốn hòn ngọc bích quanh năm đón làn gió mát lành. Đến với Cù lao An Bình, quý khách sẽ được tự tay hái những chùm chôm chôm chín mọng ngọt lịm, chèo thuyền ba lá dọc những con rạch rợp bóng dừa nước, và đắm mình trong những giai điệu đờn ca tài tử mộc mạc đậm đà tình quê hương sông nước Tây Nam Bộ.',
      durationEstimate: '1 phút 55 giây'
    },
    audioEnglish: {
      text: 'Welcome to An Binh Islet, the green heart of eco-tourism in Vinh Long province. Surrounded by the gentle rivers of Tien and Co Chien, An Binh is world-famous for fruitful orchards, tranquil canals shaded by water coconut trees, and authentic homestays showcasing Don Ca Tai Tu folk music.',
      durationEstimate: '1 minute 30 seconds'
    },
    views: 6120,
    likes: 840,
    featured: true,
    createdAt: '2026-01-05T08:00:00.000Z',
    updatedAt: '2026-03-01T14:00:00.000Z'
  },
  {
    id: 'kdl-vinh-sang',
    name: 'Khu du lịch sinh thái Vinh Sang',
    slug: 'kdl-vinh-sang',
    category: 'sinh-thai',
    district: 'Huyện Long Hồ, Tỉnh Vĩnh Long',
    address: 'Tổ 14, Ấp An Thuận, Xã An Bình, Huyện Long Hồ, Tỉnh Vĩnh Long',
    coordinates: {
      lat: 10.2815,
      lng: 105.9754,
    },
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Khu vui chơi dã ngoại ven sông đậm chất đồng quê Nam Bộ'
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        caption: 'Khu chuồng trại nuôi đà điểu và hồ cá sấu sinh thái'
      }
    ],
    shortDesc: 'Khu vui chơi sinh thái hấp dẫn với các trải nghiệm dân dã: tát mương bắt cá, câu cá sấu, cưỡi đà điểu, đi cầu khỉ và chèo thuyền.',
    overview: 'Khu du lịch sinh thái Vinh Sang là điểm hẹn giải trí lý tưởng cho gia đình, học sinh và đoàn du khách. Nơi đây tái hiện trọn vẹn nét văn hóa sinh hoạt dân dã của cư dân miền Tây kết hợp nhiều trò chơi cảm giác mạnh hấp dẫn.',
    history: 'Được xây dựng và phát triển hơn 15 năm qua bên bờ sông Cổ Chiên hiền hòa, Vinh Sang đã trở thành thương hiệu du lịch giải trí sinh thái hàng đầu của tỉnh Vĩnh Long.',
    culturalValue: 'Góp phần bảo tồn và quảng bá phong tục, lối sống và ẩm thực sông nước Cửu Long đến bạn bè trong nước và quốc tế.',
    experiences: 'Mặc áo bà ba tát mương bắt cá đồng, thưởng thức cá lóc nướng trui cuộn bánh tráng rau rừng, thử thách câu cá sấu, cưỡi đà điểu Châu Phi trên bãi cát, trượt cỏ dốc.',
    suitableTime: 'Mở cửa từ 7h30 đến 17h30 hàng ngày, phù hợp cho các chuyến đi dã ngoại cuối tuần.',
    audioVietnamese: {
      text: 'Khu du lịch sinh thái Vinh Sang chào đón quý du khách đến với thiên đường trải nghiệm sông nước miệt vườn. Tại đây, quý khách được khoác lên mình chiếc áo bà ba truyền thống, xắn quần lội mương tát cá, thử thách lòng can đảm với trò chơi câu cá sấu hay cưỡi đà điểu. Đừng quên nếm thử món cá lóc nướng trui thơm lừng vừa bắt dưới mương, nhâm nhi cùng chén rượu nếp nồng đượm nghĩa tình miền Tây.',
      durationEstimate: '1 phút 35 giây'
    },
    audioEnglish: {
      text: 'Vinh Sang Eco-tourism Destination is a premier recreational playground located on An Binh Islet. Visitors can dress in traditional farmer garments to catch fish in muddy canals, experience ostrich riding, crocodile angling, and savor freshly barbecued snakehead fish.',
      durationEstimate: '1 minute 15 seconds'
    },
    views: 5210,
    likes: 710,
    featured: true,
    createdAt: '2026-01-08T08:00:00.000Z',
    updatedAt: '2026-03-03T16:00:00.000Z'
  },
  {
    id: 'bao-tang-khmer',
    name: 'Bảo tàng Văn hóa Dân tộc Khmer',
    slug: 'bao-tang-khmer',
    category: 'lich-su-van-hoa',
    district: 'Khu liên kết văn hóa Tây Nam Bộ',
    address: 'Khóm 4, Phường 8, Quần thể di sản Ao Bà Om',
    coordinates: {
      lat: 9.9531,
      lng: 106.3142,
    },
    coverImage: 'https://images.unsplash.com/photo-1590059390046-512fb449679a?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1590059390046-512fb449679a?auto=format&fit=crop&w=1200&q=80',
        caption: 'Mặt tiền Bảo tàng mang kiến trúc đền tháp Khmer truyền thống'
      },
      {
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        caption: 'Gian trưng bày trang phục cổ truyền và nông cụ sản xuất'
      }
    ],
    shortDesc: 'Một trong hai bảo tàng văn hóa dân tộc Khmer lớn nhất cả nước, lưu giữ hàng nghìn hiện vật quý giá về đời sống, tín ngưỡng đồng bào Khmer.',
    overview: 'Bảo tàng được xây dựng với kiến trúc kết hợp hài hòa giữa truyền thống kiến trúc Khmer và công năng bảo tàng hiện đại. Nơi đây trưng bày chuyên đề về nguồn gốc, phong tục, nghệ thuật sân khấu Dù Kê, Rô Băm, nhạc ngũ âm và lễ hội truyền thống.',
    history: 'Bảo tàng khánh thành và mở cửa đón khách từ năm 1995, đóng vai trò quan trọng trong công tác bảo tồn, phát huy bản sắc văn hóa dân tộc trong cộng đồng các dân tộc anh em.',
    culturalValue: 'Kho tàng di sản vật thể và phi vật thể vô giá, minh chứng sống động cho sự hòa quyện văn hóa Việt - Khmer - Hoa trên vùng đất phương Nam.',
    experiences: 'Chiêm ngưỡng trang phục cô dâu chú rể Khmer cổ, ngắm các nhạc cụ trong dàn nhạc ngũ âm, tìm hiểu quy trình dệt lụa và khắc kinh lá buông.',
    suitableTime: 'Mở cửa từ thứ Ba đến Chủ nhật (8h00 - 11h30 và 13h30 - 17h00).',
    audioVietnamese: {
      text: 'Quý khách đang tham quan Bảo tàng Văn hóa Dân tộc Khmer, một trung tâm nghiên cứu và bảo tồn di sản độc đáo ở Nam Bộ. Bảo tàng trưng bày hàng ngàn hiện vật quý từ những bộ nông cụ khai hoang đất phù sa, những bộ trang phục lễ cưới sặc sỡ kim sa, cho đến mô hình sân khấu cổ Dù Kê và dàn nhạc ngũ âm trầm bổng. Đây là nơi tôn vinh tài hoa nghệ thuật và đời sống tâm linh phong phú của đồng bào Khmer anh em.',
      durationEstimate: '1 phút 40 giây'
    },
    audioEnglish: {
      text: 'The Museum of Khmer Culture is one of the two dedicated museums in Vietnam preserving the invaluable heritage of the Khmer ethnic community. Its exhibits showcase ancient palm-leaf scriptures, traditional costumes, agricultural implements, and sacred musical instruments.',
      durationEstimate: '1 minute 20 seconds'
    },
    views: 2430,
    likes: 295,
    featured: false,
    createdAt: '2026-01-22T08:00:00.000Z',
    updatedAt: '2026-03-01T15:00:00.000Z'
  },
  {
    id: 'lo-gach-mang-thit',
    name: 'Vương quốc đỏ - Lò gạch gốm Mang Thít',
    slug: 'lo-gach-mang-thit',
    category: 'lang-nghe',
    district: 'Huyện Mang Thít, Tỉnh Vĩnh Long',
    address: 'Dọc dòng Kênh Thầy Cai và Sông Cổ Chiên, Huyện Mang Thít, Tỉnh Vĩnh Long',
    coordinates: {
      lat: 10.1983,
      lng: 106.0712,
    },
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
        caption: 'Hàng ngàn lò gạch hình tháp bút soi bóng xuống dòng kênh Thầy Cai'
      },
      {
        url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
        caption: 'Khung cảnh cổ kính kỳ vĩ được ví như di sản đương đại thế giới'
      }
    ],
    shortDesc: 'Vương quốc gốm đỏ độc nhất vô nhị ở Đông Nam Á với hơn 1.000 lò nung hình vòm tháp cổ kính trải dài ven sông Cổ Chiên.',
    overview: 'Làng gốm Mang Thít có tuổi đời hơn một thế kỷ, từng được mệnh danh là "Vương quốc đỏ" bởi ánh lửa đỏ rực của hàng ngàn lò gốm san sát nhau trải dài hàng chục cây số men theo kênh Thầy Cai.',
    history: 'Nghề làm gạch ngói và gốm đỏ ở Mang Thít hình thành từ đầu thế kỷ 20 nhờ nguồn đất sét đỏ đặc thù chỉ có ở bờ sông Cổ Chiên. Gốm đỏ Mang Thít được nung bằng trấu, tạo nên màu đỏ tự nhiên không cần men màu, xuất khẩu đi nhiều quốc gia trên thế giới.',
    culturalValue: 'Hiện nay, Vĩnh Long đang triển khai đề án "Di sản Đương đại Mang Thít", bảo tồn các lò gạch thành bảo tàng ngoài trời độc đáo kết hợp du lịch sinh thái.',
    experiences: 'Đi thuyền trên kênh ngắm bình minh phản chiếu trên các vòm lò gạch, chụp ảnh check-in cổ kính, thử tự tay chuốt gốm và mua quà lưu niệm gốm đỏ.',
    suitableTime: 'Thời điểm sáng sớm (6h00 - 8h00) hoặc hoàng hôn (16h30 - 18h00) khi ánh sáng phản chiếu màu đỏ đất nung đẹp nhất.',
    audioVietnamese: {
      text: 'Chào mừng quý khách đến với Vương quốc Đỏ Mang Thít, niềm tự hào của vùng đất Vĩnh Long. Dọc theo dòng kênh Thầy Cai và sông Cổ Chiên là hơn một ngàn chiếc lò nung gạch gốm có hình dáng như những tòa tháp Chăm cổ kính, vươn cao lên bầu trời xanh biếc. Dưới bàn tay tài hoa của người nghệ nhân đất cù lao, những khối đất sét phù sa đã hóa thành những tác phẩm gốm đỏ mộc mạc tinh xảo, làm say lòng du khách khắp năm châu.',
      durationEstimate: '1 phút 50 giây'
    },
    audioEnglish: {
      text: 'Welcome to the Red Kingdom of Mang Thit, the singular red ceramic pottery village in Southeast Asia. Lining the picturesque canals are over a thousand brick kilns resembling ancient bell towers, crafting natural terracotta pottery celebrated worldwide.',
      durationEstimate: '1 minute 20 seconds'
    },
    views: 7420,
    likes: 980,
    featured: true,
    createdAt: '2026-01-02T08:00:00.000Z',
    updatedAt: '2026-03-04T12:00:00.000Z'
  },
  {
    id: 'khu-luu-niem-vo-van-kiet',
    name: 'Khu lưu niệm Thủ tướng Võ Văn Kiệt',
    slug: 'khu-luu-niem-vo-van-kiet',
    category: 'lich-su-van-hoa',
    district: 'Huyện Vũng Liêm, Tỉnh Vĩnh Long',
    address: 'Thị trấn Vũng Liêm, Huyện Vũng Liêm, Tỉnh Vĩnh Long',
    coordinates: {
      lat: 10.0831,
      lng: 106.1856,
    },
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
        caption: 'Không gian mở thanh tịnh tại Khu lưu niệm Thủ tướng Võ Văn Kiệt'
      },
      {
        url: 'https://images.unsplash.com/photo-1590059390046-512fb449679a?auto=format&fit=crop&w=1200&q=80',
        caption: 'Bức chân dung Bác Sáu Dân và các công trình mang dấu ấn thế kỷ'
      }
    ],
    shortDesc: 'Công trình văn hóa tri ân "kiến trúc sư của công cuộc đổi mới", người con ưu tú đất Vũng Liêm, Vĩnh Long.',
    overview: 'Khu lưu niệm được thiết kế theo lối kiến trúc "vườn mở", không có tường rào bê tông ngăn cách, phản ánh đúng tính cách gần gũi, bao dung và cởi mở của cố Thủ tướng Võ Văn Kiệt (Bác Sáu Dân).',
    history: 'Đồng chí Võ Văn Kiệt (1922 - 2008) là nhà lãnh đạo xuất sắc có tầm nhìn chiến lược, người gắn liền với các công trình mang tính bước ngoặt: Đường dây tải điện 500kV Bắc - Nam, chương trình khai phá Đồng Tháp Mười, thoát lũ ra biển Tây.',
    culturalValue: 'Biểu tượng của tinh thần đổi mới sáng tạo, dám nghĩ, dám làm, dám chịu trách nhiệm vì lợi ích của nhân dân và đất nước.',
    experiences: 'Chiêm bái dâng hương, ngắm hoa sen trong hồ, tham quan nhà trưng bày hình ảnh và tư liệu ghi dấu công lao Bác Sáu Dân.',
    suitableTime: 'Hàng ngày từ 7h00 đến 17h00.',
    audioVietnamese: {
      text: 'Khu lưu niệm Thủ tướng Võ Văn Kiệt tại thị trấn Vũng Liêm là nơi tưởng nhớ và tri ân Bác Sáu Dân - vị Thủ tướng của lòng dân, kiến trúc sư trưởng của công cuộc Đổi mới đất nước. Không gian khu lưu niệm mở ra bát ngát giữa vườn cây xanh tươi và hồ sen thơm ngát, thể hiện trọn vẹn phong cách sống giản dị, gần gũi, chan chứa ân tình của Bác Sáu đối với đồng bào và quê hương Vĩnh Long.',
      durationEstimate: '1 phút 40 giây'
    },
    audioEnglish: {
      text: 'The Memorial of Prime Minister Vo Van Kiet in Vung Liem honors the great reformer affectionately known as Uncle Sau Dan. Designed as an open garden without walls, it symbolizes his visionary openness and profound devotion to the people of Vietnam.',
      durationEstimate: '1 minute 15 seconds'
    },
    views: 4150,
    likes: 560,
    featured: false,
    createdAt: '2026-01-12T08:00:00.000Z',
    updatedAt: '2026-02-25T11:00:00.000Z'
  },
  {
    id: 'van-thanh-mieu-vinh-long',
    name: 'Văn Thánh Miếu Vĩnh Long',
    slug: 'van-thanh-mieu-vinh-long',
    category: 'lich-su-van-hoa',
    district: 'Thành phố Vĩnh Long',
    address: 'Đường Trần Phú, Phường 4, Thành phố Vĩnh Long, Tỉnh Vĩnh Long',
    coordinates: {
      lat: 10.2392,
      lng: 105.9723,
    },
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        caption: 'Cổng tam quan cổ kính Văn Thánh Miếu Vĩnh Long xây dựng năm 1864'
      },
      {
        url: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
        caption: 'Điện Đại Thành và Văn Xương Các uy nghiêm bên dòng sông Long Hồ'
      }
    ],
    shortDesc: 'Một trong ba Văn Thánh Miếu đầu tiên ở Nam Bộ, biểu tượng cho truyền thống hiếu học và tôn sư trọng đạo của vùng đất địa linh nhân kiệt.',
    overview: 'Văn Thánh Miếu Vĩnh Long được khởi công xây dựng từ năm 1864 dưới sự khởi xướng của cụ Phan Thanh Giản và cụ Nguyễn Thông nhằm giữ gìn nền văn hóa Nho học dân tộc trước sự xâm lăng của thực dân phương Tây.',
    history: 'Quần thể gồm Đại Thành Điện thờ Khổng Tử và các bậc hiền triết, Văn Xương Các hai tầng bằng gỗ quý - nơi tao đàn văn thơ tụ hội và thờ các bậc danh nhân có công lớn với phương Nam như Võ Trường Toản.',
    culturalValue: 'Di tích Lịch sử - Văn hóa cấp Quốc gia, biểu tượng văn hiến rạng rỡ của đất phương Nam.',
    experiences: 'Chiêm ngưỡng kiến trúc gỗ truyền thống Nam Bộ thế kỷ 19, cầu chúc con đường học tập đăng khoa đỗ đạt, ngắm sông Long Hồ thơ mộng.',
    suitableTime: 'Hàng ngày từ 7h00 - 17h00.',
    audioVietnamese: {
      text: 'Văn Thánh Miếu Vĩnh Long, tọa lạc bên bờ sông Long Hồ thơ mộng, là biểu tượng trường tồn của truyền thống hiếu học và tôn sư trọng đạo của xứ sở Nam Kỳ. Được xây dựng từ năm 1864, đây là điểm tựa tinh thần của các sĩ phu yêu nước nhằm bảo tồn tinh hoa văn hóa dân tộc. Bước qua cổng tam quan rêu phong, du khách sẽ cảm nhận được khí thiêng sông núi và vẻ đẹp tôn nghiêm của di tích lịch sử quốc gia danh tiếng này.',
      durationEstimate: '1 phút 40 giây'
    },
    audioEnglish: {
      text: 'Vinh Long Temple of Literature is one of the earliest Confucian shrines built in Southern Vietnam in 1864. It honors great scholars, symbolizing the enduring academic tradition, wisdom, and cultural pride of Vinh Long province.',
      durationEstimate: '1 minute 15 seconds'
    },
    views: 3820,
    likes: 490,
    featured: false,
    createdAt: '2026-01-18T08:00:00.000Z',
    updatedAt: '2026-02-27T16:00:00.000Z'
  },
  {
    id: 'bien-ba-dong',
    name: 'Biển Ba Động - Tuyến liên kết Duyên hải',
    slug: 'bien-ba-dong',
    category: 'sinh-thai',
    district: 'Tuyến du lịch liên kết Đồng bằng Sông Cửu Long',
    address: 'Xã Trường Long Hòa, Tuyến liên kết biển sinh thái Tây Nam Bộ',
    coordinates: {
      lat: 9.6825,
      lng: 106.5647,
    },
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Bãi biển cát dài thoai thoải cùng rừng dương xanh ngút ngàn'
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        caption: 'Cánh đồng điện gió ven biển hiện đại hòa cùng thiên nhiên'
      }
    ],
    shortDesc: 'Bãi biển hoang sơ nổi tiếng gắn liền với rừng dương vi vu gió biển và các cánh đồng điện gió tráng lệ nơi cửa biển Cửu Long.',
    overview: 'Biển Ba Động sở hữu bờ cát mịn thoai thoải trải dài hơn 10km, rợp mát bóng rừng phi lao chắn gió. Nơi đây là điểm kết nối không thể thiếu trong chuỗi hành trình khám phá từ miệt vườn sông nước ngọt Vĩnh Long ra đến vùng duyên hải biển Tây Nam Bộ.',
    history: 'Từ đầu thế kỷ 20 người Pháp đã chọn Ba Động làm nơi nghỉ dưỡng ven biển. Ngày nay, vùng biển còn có thêm những trụ tuabin điện gió sừng sững trên biển tạo nên cảnh quan kỳ vĩ.',
    culturalValue: 'Nơi giao thoa sinh thái mặn - ngọt - lợ, gắn liền với văn hóa làng chài đánh bắt hải sản truyền thống và năng lượng tái tạo xanh tương lai.',
    experiences: 'Tắm biển đón bình minh, thưởng thức hải sản tươi rói (chù ụ rang me, tôm sú biển, nghêu nướng), check-in cánh đồng điện gió.',
    suitableTime: 'Thời điểm lý tưởng nhất từ tháng 12 đến tháng 5 năm sau khi biển êm, sóng lặng và nắng đẹp.',
    audioVietnamese: {
      text: 'Biển Ba Động là điểm đến kỳ thú trong hành trình du lịch liên kết miền Tây sông nước. Khác với vẻ ồn ào náo nhiệt của các bãi biển du lịch khác, Ba Động mang nét đẹp hiền hòa, phóng khoáng với rặng phi lao ngân nga trong gió biển và những cánh đồng tuabin điện gió hiện đại vươn mình giữa sóng nước đại dương bao la.',
      durationEstimate: '1 phút 30 giây'
    },
    audioEnglish: {
      text: 'Ba Dong Beach offers a breezy seaside escape on the Southwestern coast, featuring extensive casuarina groves, tranquil waves, and modern offshore wind power farms creating magnificent coastal vistas.',
      durationEstimate: '1 minute 10 seconds'
    },
    views: 3190,
    likes: 388,
    featured: false,
    createdAt: '2026-01-25T08:00:00.000Z',
    updatedAt: '2026-02-28T10:00:00.000Z'
  }
];

export const initialNews: NewsItem[] = [
  {
    id: 'tin-1',
    title: 'Vĩnh Long khai mạc Ngày hội Du lịch Sông nước Miệt vườn và Gốm đỏ Mang Thít',
    slug: 'ngay-hoi-du-lich-song-nuoc-miet-vuon-vinh-long',
    summary: 'Sự kiện văn hóa du lịch quy mô lớn quy tụ hàng chục hoạt động văn nghệ dân gian, đua thuyền, triển lãm gốm đỏ và hội thi ẩm thực đặc sản miền Tây.',
    content: `Ngày hội Du lịch tỉnh Vĩnh Long năm nay là điểm nhấn nổi bật thu hút đông đảo du khách thập phương. Với chủ đề "Du lịch Vĩnh Long - Điểm hẹn Sông nước Miệt vườn và Di sản Gốm đỏ", chuỗi hoạt động kéo dài 4 ngày bao gồm:
1. Triển lãm hơn 500 tác phẩm gốm đỏ Mang Thít tinh xảo tại trung tâm thành phố.
2. Trình diễn nghệ thuật Đờn ca tài tử Nam Bộ trên sông Cổ Chiên.
3. Hội chợ trái cây đặc sản Cù lao An Bình (chôm chôm, sầu riêng, bưởi Năm Roi, bưởi da xanh).
4. Hội thảo ứng dụng công nghệ thông minh và trí tuệ nhân tạo (AI) trong bảo tồn di sản và xúc tiến du lịch học đường.`,
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    author: 'Ban Tuyên giáo Du lịch Vĩnh Long',
    publishedAt: '2026-03-01T09:00:00.000Z',
    category: 'Sự kiện du lịch',
    status: 'published',
    views: 1840
  },
  {
    id: 'tin-2',
    title: 'Học sinh Trường THCS và THPT Hoàng Thái Hiếu sáng tạo nền tảng Du lịch Thông minh',
    slug: 'hoc-sinh-hoang-thai-hieu-sang-tao-du-lich-thong-minh',
    summary: 'Hai học sinh Trần Nguyễn Quốc Thắng và Chung Phước Duyên (Lớp 9A8) tham gia Cuộc thi Sáng tạo Khoa học Kỹ thuật với website du lịch tích hợp thuyết minh AI.',
    content: `Xuất phát từ niềm đam mê công nghệ và tình yêu sâu đậm đối với quê hương Vĩnh Long, nhóm tác giả Trần Nguyễn Quốc Thắng và Chung Phước Duyên (Lớp 9A8, Trường THCS và THPT Hoàng Thái Hiếu) đã nghiên cứu và phát triển thành công dự án "DU LỊCH THÔNG MINH VĨNH LONG – SMART TOURISM VĨNH LONG".
Dự án ứng dụng công nghệ chuyển đổi văn bản thành giọng nói (Text-to-Speech) thông minh, giúp du khách trong và ngoài nước dễ dàng lắng nghe thuyết minh lịch sử, văn hóa tại từng di tích bằng cả tiếng Việt và tiếng Anh. Đồng thời, hệ thống tích hợp bản đồ số thông minh và hệ thống quản trị dữ liệu thực tế.`,
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    author: 'CLB STEM Hoàng Thái Hiếu',
    publishedAt: '2026-02-20T14:30:00.000Z',
    category: 'Khoa học kỹ thuật',
    status: 'published',
    views: 2950
  },
  {
    id: 'tin-3',
    title: 'Bảo tồn và phát huy giá trị Đề án Di sản Đương đại Mang Thít',
    slug: 'bao-ton-de-an-di-san-duong-dai-mang-thit',
    summary: 'Tỉnh Vĩnh Long tiếp tục triển khai các phương án bảo vệ vòm lò gạch truyền thống, hướng tới xây dựng công viên di sản công nghiệp gốm đỏ tầm cỡ quốc tế.',
    content: `Đề án Di sản đương đại Mang Thít đang từng bước được triển khai với mục tiêu bảo tồn nguyên trạng hàng ngàn lò gạch gốm đỏ ven sông Cổ Chiên và kênh Thầy Cai.
Đây không chỉ là nơi lưu giữ nét đẹp lao động của các thế hệ nghệ nhân mà còn mở ra cơ hội phát triển du lịch văn hóa độc đáo, đưa hình ảnh "Vương quốc Đỏ" vươn xa trên bản đồ du lịch thế giới.`,
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    author: 'Sở Văn hóa, Thể thao và Du lịch',
    publishedAt: '2026-02-10T10:00:00.000Z',
    category: 'Văn hóa - Di sản',
    status: 'published',
    views: 1420
  }
];

export const initialUsers: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@vinhlongtour.vn',
    fullName: 'Quản trị viên Hệ thống (Admin)',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'editor-1',
    username: 'bientapvien',
    email: 'bientap@vinhlongtour.vn',
    fullName: 'Ban Biên Tập Nội Dung',
    role: 'editor',
    createdAt: '2026-01-02T00:00:00.000Z'
  }
];

export const initialStats: DashboardStats = {
  totalPlaces: initialPlaces.length,
  totalImages: initialPlaces.reduce((sum, p) => sum + p.gallery.length + 1, 0),
  totalNews: initialNews.length,
  totalViews: 37310,
  totalAudioListens: 8420
};
