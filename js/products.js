/**
 * LOOPI - Danh mục sản phẩm (bản địa hóa Việt Nam)
 * Slogan: "THINGS WORTH FINDING"
 * Giá tính bằng VNĐ (số nguyên). Dùng formatVND() để hiển thị.
 */

const FREE_SHIP_THRESHOLD = 299000; // Miễn phí vận chuyển từ 299.000₫
const SHIPPING_FEE = 25000;         // Phí vận chuyển tiêu chuẩn

function formatVND(amount) {
  return Math.round(amount).toLocaleString("vi-VN") + "₫";
}

const CATEGORIES = [
  {
    id: "home-living",
    name: "Nhà & Đời Sống",
    tagline: "Đèn bàn, nến thơm, chậu cây mini – góc nhỏ ấm áp cho phòng trọ và bàn làm việc.",
    itemCount: 24,
    image: "assets/images/cat_home.jpg",
    icon: "🏠"
  },
  {
    id: "accessories",
    name: "Phụ Kiện",
    tagline: "Túi tote, móc khóa và những món nhỏ xinh mang theo mỗi ngày.",
    itemCount: 18,
    image: "assets/images/cat_accessories.jpg",
    icon: "👜"
  },
  {
    id: "stationery",
    name: "Văn Phòng Phẩm",
    tagline: "Sổ tay, bút, sticker và kệ bàn học để ngày học – làm việc thêm hứng khởi.",
    itemCount: 16,
    image: "assets/images/cat_stationery.jpg",
    icon: "✏️"
  },
  {
    id: "lifestyle",
    name: "Phong Cách Sống",
    tagline: "Bình nước, ly giữ nhiệt, giá đỡ điện thoại – tiện dụng cho nhịp sống năng động.",
    itemCount: 22,
    image: "assets/images/cat_lifestyle.jpg",
    icon: "🎧"
  },
  {
    id: "gifts",
    name: "Quà Tặng",
    tagline: "Hộp quà bất ngờ, đồng hồ để bàn và những món quà dễ thương cho người thân.",
    itemCount: 15,
    image: "assets/images/cat_gifts.jpg",
    icon: "🎁"
  }
];

const PRODUCTS = [
  {
    id: "prod-1",
    name: "Đèn Bàn Nấm Aura",
    category: "home-living",
    categoryName: "Nhà & Đời Sống",
    price: 349000,
    originalPrice: 399000,
    rating: 4.9,
    reviewsCount: 162,
    badge: "Bán Chạy",
    image: "assets/images/prod_lamp.jpg",
    colorway: "Trắng Kem & Đồng Thau",
    curatorNote: "Ánh sáng vàng dịu giúp góc học tập hay phòng ngủ của bạn thư giãn hơn hẳn.",
    description: "Đèn bàn hình nấm xinh xắn với chân đồng và chụp đèn vải màu kem. Cảm ứng 3 mức sáng, từ ánh nến ấm áp đến ánh sáng học bài.",
    features: [
      "Cảm ứng 3 mức sáng (Vàng ấm / Hoàng hôn / Trắng học tập)",
      "Pin sạc USB-C, dùng không dây đến 14 giờ",
      "Đế nặng có lót chống trượt, đứng vững trên mọi mặt bàn",
      "Chụp đèn chống chói, bảo vệ mắt khi học khuya"
    ]
  },
  {
    id: "prod-2",
    name: "Nến Thơm Sáp Đậu Nành – Hoa Nhài",
    category: "home-living",
    categoryName: "Nhà & Đời Sống",
    price: 129000,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 138,
    badge: "Dịu Nhẹ",
    image: "assets/images/prod_candle.jpg",
    colorway: "Hoa Nhài & Gỗ Tuyết Tùng",
    curatorNote: "Hương thơm êm dịu giúp bạn thư giãn sau một ngày dài học tập và làm việc.",
    description: "Nến thơm sáp đậu nành thuần chay trong hũ thủy tinh nâu, cháy sạch, ít khói. Hương hoa nhài nhẹ nhàng quyện cùng gỗ tuyết tùng.",
    features: [
      "Sáp đậu nành tự nhiên, không paraffin",
      "Thời gian cháy khoảng 35 giờ (150g)",
      "Bấc cotton cháy đều, ít khói",
      "Hũ thủy tinh có nắp, tái sử dụng làm hũ đựng đồ nhỏ"
    ]
  },
  {
    id: "prod-3",
    name: "Chậu Cây Mini Gốm Sứ",
    category: "home-living",
    categoryName: "Nhà & Đời Sống",
    price: 79000,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 96,
    badge: "Xanh Mát",
    image: "assets/images/prod_plant.jpg",
    colorway: "Gốm Trắng Kem & Sen Đá",
    curatorNote: "Một chút xanh trên bàn làm việc giúp tinh thần nhẹ nhõm hơn mỗi sáng.",
    description: "Chậu gốm sứ mini kèm sen đá thật, kích thước vừa lòng bàn tay. Dễ chăm sóc, phù hợp cả những bạn bận rộn.",
    features: [
      "Gốm sứ tráng men mờ, có lỗ thoát nước và đĩa lót",
      "Kèm cây sen đá và giá thể đã trộn sẵn",
      "Kích thước 8 × 8 cm, vừa vặn cạnh laptop",
      "Kèm thẻ hướng dẫn chăm sóc bằng tiếng Việt"
    ]
  },
  {
    id: "prod-4",
    name: "Sổ Tay Bìa Vải Xanh Sage",
    category: "stationery",
    categoryName: "Văn Phòng Phẩm",
    price: 89000,
    originalPrice: 109000,
    rating: 4.9,
    reviewsCount: 178,
    badge: "Mới Về",
    image: "assets/images/prod_journal.jpg",
    colorway: "Xanh Sage & Chỉ Đồng",
    curatorNote: "Giấy dày mịn, viết bút gel hay bút mực đều không lem sang trang sau.",
    description: "Sổ tay bìa cứng bọc vải màu xanh sage, gáy khâu chỉ mở phẳng 180°. 192 trang giấy định lượng 100gsm kẻ chấm.",
    features: [
      "192 trang, kẻ chấm 5mm, đánh số trang sẵn",
      "Giấy 100gsm chống lem, hạn chế thấm sang mặt sau",
      "Gáy may chỉ, mở phẳng 180° khi viết",
      "Có dây đánh dấu trang và túi đựng giấy ở bìa sau"
    ]
  },
  {
    id: "prod-5",
    name: "Set Bút Gel Pastel 5 Màu",
    category: "stationery",
    categoryName: "Văn Phòng Phẩm",
    price: 49000,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 215,
    badge: "Được Yêu Thích",
    image: "assets/images/prod_pens.jpg",
    colorway: "Hồng – Xanh – Mint – Vàng – Tím",
    curatorNote: "Mực ra đều, màu pastel dịu mắt – cực hợp để ghi chú và trang trí sổ.",
    description: "Set 5 bút gel ngòi 0.5mm với 5 tông màu pastel dễ thương. Thân bút nhẹ, cầm êm tay khi ghi chép nhiều giờ.",
    features: [
      "5 màu pastel: hồng, xanh dương, mint, vàng, tím",
      "Ngòi 0.5mm, mực gel ra đều, khô nhanh",
      "Thân bút nhẹ, có đệm cao su chống mỏi tay",
      "Đi kèm hộp đựng gọn nhẹ"
    ]
  },
  {
    id: "prod-6",
    name: "Set Sticker Dễ Thương 60 Miếng",
    category: "stationery",
    categoryName: "Văn Phòng Phẩm",
    price: 59000,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 241,
    badge: "Dễ Thương",
    image: "assets/images/prod_sticker.jpg",
    colorway: "Mix Pastel & Họa Tiết Vòng Lặp",
    curatorNote: "Dán sổ, laptop hay bình nước đều đẹp – mỗi miếng là một chút cá tính.",
    description: "Set 60 sticker chống nước, cắt rời sẵn, thiết kế độc quyền từ LOOPI với chủ đề khám phá, cà phê và học đường.",
    features: [
      "60 miếng, nhiều kích thước khác nhau",
      "Chất liệu PVC mờ, chống nước, không phai màu",
      "Dán được lên sổ, laptop, bình nước, vali",
      "Dễ bóc, không để lại keo thừa"
    ]
  },
  {
    id: "prod-7",
    name: "Kệ Bàn Học Gỗ Đa Năng",
    category: "stationery",
    categoryName: "Văn Phòng Phẩm",
    price: 399000,
    originalPrice: 449000,
    rating: 4.9,
    reviewsCount: 84,
    badge: "Gọn Gàng",
    image: "assets/images/prod_shelf.jpg",
    colorway: "Gỗ Óc Chó & Trắng Sữa",
    curatorNote: "Nâng màn hình, thêm chỗ để sổ, bút và đồ nhỏ – bàn học gọn hẳn.",
    description: "Kệ gỗ hai tầng đặt trên bàn, vừa làm giá nâng laptop vừa có ngăn để sổ, bút và phụ kiện. Lắp ráp trong 5 phút, không cần dụng cụ.",
    features: [
      "Gỗ MDF phủ veneer óc chó, bề mặt chống xước",
      "Kích thước 55 × 20 × 12 cm, chịu tải đến 20kg",
      "Tháo lắp dễ dàng, không cần khoan vít",
      "Phù hợp bàn học, phòng trọ và góc làm việc nhỏ"
    ]
  },
  {
    id: "prod-8",
    name: "Túi Tote Canvas LOOPI",
    category: "accessories",
    categoryName: "Phụ Kiện",
    price: 149000,
    originalPrice: 179000,
    rating: 4.9,
    reviewsCount: 193,
    badge: "Đi Học Đi Làm",
    image: "assets/images/prod_bag.jpg",
    colorway: "Be Kem & Họa Tiết Xanh",
    curatorNote: "Đựng vừa laptop 14 inch, sổ tay và bình nước – đủ cho cả ngày dài.",
    description: "Túi tote vải canvas dày dặn với ngăn trong có khóa kéo. In họa tiết vòng lặp LOOPI, đơn giản mà vẫn nổi bật.",
    features: [
      "Canvas cotton 12oz dày, bền, ít nhăn",
      "Ngăn trong có khóa kéo, thêm 1 túi nhỏ đựng ví/điện thoại",
      "Quai dài 60cm, đeo vai thoải mái",
      "Chứa vừa laptop 14 inch và tài liệu A4"
    ]
  },
  {
    id: "prod-9",
    name: "Móc Khóa Acrylic Vòng Lặp",
    category: "accessories",
    categoryName: "Phụ Kiện",
    price: 69000,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 127,
    badge: "Xu Hướng",
    image: "assets/images/prod_keychain.jpg",
    colorway: "Hồng Phấn & Xanh Dương",
    curatorNote: "Treo balo, túi tote hay chìa khóa xe – món nhỏ nhưng thêm điểm nhấn.",
    description: "Móc khóa acrylic trong suốt hình biểu tượng LOOPI, kèm charm kim loại và dây đeo ngắn. Nhẹ, bền và rất dễ phối đồ.",
    features: [
      "Acrylic dày 3mm, in hai mặt chống trầy",
      "Khoen và móc kim loại không gỉ",
      "Có 4 mẫu ngẫu nhiên để bạn sưu tầm",
      "Trọng lượng chỉ 12g, không nặng túi"
    ]
  },
  {
    id: "prod-10",
    name: "Bình Nước Nhựa Tritan 700ml",
    category: "lifestyle",
    categoryName: "Phong Cách Sống",
    price: 179000,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 171,
    badge: "Sống Xanh",
    image: "assets/images/prod_bottle.jpg",
    colorway: "Xanh Mint Mờ",
    curatorNote: "Có vạch chia ml nhắc bạn uống đủ nước mỗi ngày, mang đi học rất tiện.",
    description: "Bình nước 700ml làm từ nhựa Tritan an toàn, có vạch chia thời gian uống nước và quai xách tiện lợi. Nắp bật một tay, kín nước.",
    features: [
      "Nhựa Tritan không chứa BPA, bền và trong",
      "Vạch chia thời gian giúp nhắc uống đủ nước",
      "Nắp bật một tay, gioăng silicone chống rò rỉ",
      "Lọt vừa ngăn bên túi balo và giá để ly trên xe"
    ]
  },
  {
    id: "prod-11",
    name: "Ly Giữ Nhiệt Inox 500ml",
    category: "lifestyle",
    categoryName: "Phong Cách Sống",
    price: 249000,
    originalPrice: 299000,
    rating: 4.9,
    reviewsCount: 156,
    badge: "Giữ Nhiệt 12h",
    image: "assets/images/prod_tumbler.jpg",
    colorway: "Xanh Bạc Hà & Inox",
    curatorNote: "Giữ lạnh đến 24 giờ, giữ nóng 12 giờ – cà phê và trà đào luôn đúng vị.",
    description: "Ly giữ nhiệt inox 304 hai lớp chân không, kèm nắp trượt và ống hút inox. Phủ sơn tĩnh điện mờ chống trượt, không đọng nước bên ngoài.",
    features: [
      "Inox 304 hai lớp chân không, giữ lạnh 24h, giữ nóng 12h",
      "Dung tích 500ml, vừa khay để ly trên xe máy và ô tô",
      "Nắp trượt chống đổ kèm ống hút inox có thể tháo rửa",
      "Rửa được bằng tay, không chứa BPA"
    ]
  },
  {
    id: "prod-12",
    name: "Giá Đỡ Điện Thoại Gấp Gọn",
    category: "lifestyle",
    categoryName: "Phong Cách Sống",
    price: 99000,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 148,
    badge: "Tiện Lợi",
    image: "assets/images/prod_phonestand.jpg",
    colorway: "Hồng Phấn / Trắng Sữa",
    curatorNote: "Xem phim, học online hay gọi video đều ổn – gấp lại nhỏ bằng bao diêm.",
    description: "Giá đỡ điện thoại hợp kim nhôm, điều chỉnh nhiều góc, gấp gọn bỏ túi. Đế silicone chống trượt, dùng được cho cả máy tính bảng nhỏ.",
    features: [
      "Hợp kim nhôm chắc chắn, điều chỉnh góc 0–90°",
      "Gấp gọn, dày chỉ khoảng 1cm",
      "Đế silicone chống trượt, không để lại vết trên bàn",
      "Dùng được cho điện thoại và máy tính bảng đến 10 inch"
    ]
  },
  {
    id: "prod-13",
    name: "Đồng Hồ Để Bàn Mini Retro",
    category: "gifts",
    categoryName: "Quà Tặng",
    price: 199000,
    originalPrice: 229000,
    rating: 4.7,
    reviewsCount: 74,
    badge: "Quà Xinh",
    image: "assets/images/prod_clock.jpg",
    colorway: "Xanh Pastel & Mặt Trắng",
    curatorNote: "Chạy êm, đẹp như món đồ trang trí – quà tặng bạn bè rất hợp.",
    description: "Đồng hồ để bàn kim trôi êm không tiếng tích tắc, thiết kế retro bo tròn. Có đèn nền nhẹ và chuông báo thức tăng dần âm lượng.",
    features: [
      "Máy kim trôi êm, không tiếng tích tắc",
      "Đèn nền dịu và báo thức tăng dần âm lượng",
      "Dùng 1 pin AA (đã kèm theo), chạy khoảng 1 năm",
      "Thiết kế gọn, đặt vừa bàn học hoặc đầu giường"
    ]
  },
  {
    id: "prod-14",
    name: "Hộp Quà Khám Phá LOOPI",
    category: "gifts",
    categoryName: "Quà Tặng",
    price: 249000,
    originalPrice: 299000,
    rating: 4.9,
    reviewsCount: 342,
    badge: "Biểu Tượng LOOPI",
    image: "assets/images/prod_giftbox.jpg",
    colorway: "Giấy Kraft & Ruy Băng Hồng",
    curatorNote: "4 món bất ngờ được chọn riêng – mở hộp là một lần khám phá thú vị.",
    description: "Hộp quà bí ẩn gồm 4 món đồ đẹp và hữu ích (giá trị từ 350.000₫) được chọn ngẫu nhiên từ các bộ sưu tập LOOPI, đóng gói sẵn để tặng.",
    features: [
      "4 món đồ thuộc nhà, văn phòng phẩm và phụ kiện",
      "Kèm thiệp viết tay và thẻ câu chuyện sản phẩm",
      "Đóng gói giấy kraft thân thiện môi trường",
      "Đổi trả trong 7 ngày nếu sản phẩm lỗi"
    ]
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CATEGORIES, PRODUCTS, formatVND, FREE_SHIP_THRESHOLD, SHIPPING_FEE };
}