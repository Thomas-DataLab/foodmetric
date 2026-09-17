"""
config.py — FoodMetric Taxonomy & Filter Rules
"""

CATEGORIES = {
    "banh-trang": {
        "name": "Bánh Tráng & Muối Sốt",
        "keywords": ["bánh tráng phơi sương", "bánh tráng trộn", "bánh tráng xì ke", "bánh tráng bơ", "muối nhuyễn Tây Ninh"],
        "base_volume": 25000,
    },
    "kho-cac-loai": {
        "name": "Khô Các Loại & Thịt Sấy",
        "keywords": ["khô gà lá chanh", "khô bò miếng", "khô heo cháy tỏi", "khô mực cán tẩm vị", "mực xé hấp nước dừa"],
        "base_volume": 18000,
    },
    "com-chay": {
        "name": "Cơm Cháy & Snack Chiên",
        "keywords": ["cơm cháy chà bông", "cơm cháy đáy nồi", "cơm cháy sốt mắm hành", "da heo chiên giòn", "rong biển cháy tỏi"],
        "base_volume": 14000,
    },
    "an-vat-khac": {
        "name": "Bánh Kẹo & Đặc Sản Vùng Miền",
        "keywords": ["kẹo chuối tươi Bến Tre", "bánh pía mini lava", "kẹo dồi lạc", "bánh dừa nướng sầu riêng", "bánh đậu xanh mochi"],
        "base_volume": 12000,
    },
    "do-uong": {
        "name": "Trà & Đồ Uống Pha Sẵn",
        "keywords": ["cà phê muối vị phô mai", "trà mãng cầu", "trà sữa tự pha", "set chè dưỡng nhan", "chè khúc bạch"],
        "base_volume": 9000,
    }
}

# Exclusion list to filter out packaging, plastic jars, clothes, accessories
BLACKLIST_KEYWORDS = [
    "hũ", "hộp nhựa", "túi zip", "khay đựng", "áo thun", "váy", "muối chấm lẻ",
    "tem dán", "vỏ hộp", "chai chiết", "hũ thuỷ tinh", "kệ đựng", "combo 1k", "tạp dề"
]

PRICE_FLOOR_VND = 15000
PRICE_CEILING_VND = 600000
