interface MockProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  stock: number;
}

interface MockUser {
  id: string;
  email: string;
  name: string;
}

export const mockProducts: MockProduct[] = [
  {
    id: "1",
    name: "미니멀 백팩",
    price: 89000,
    description: "깔끔한 디자인의 미니멀 백팩. 노트북 수납 가능.",
    imageUrl: "https://picsum.photos/seed/backpack/400/400",
    category: "가방",
    stock: 15,
  },
  {
    id: "2",
    name: "무선 블루투스 이어폰",
    price: 45000,
    description: "고음질 무선 이어폰. 노이즈 캔슬링 지원.",
    imageUrl: "https://picsum.photos/seed/earbuds/400/400",
    category: "전자기기",
    stock: 30,
  },
  {
    id: "3",
    name: "스테인리스 텀블러",
    price: 32000,
    description: "보온보냉 가능한 500ml 텀블러.",
    imageUrl: "https://picsum.photos/seed/tumbler/400/400",
    category: "주방",
    stock: 50,
  },
  {
    id: "4",
    name: "코튼 오버핏 티셔츠",
    price: 28000,
    description: "편안한 오버핏 면 티셔츠. 다양한 색상 보유.",
    imageUrl: "https://picsum.photos/seed/tshirt/400/400",
    category: "의류",
    stock: 100,
  },
  {
    id: "5",
    name: "가죽 카드지갑",
    price: 55000,
    description: "천연 가죽 카드지갑. 카드 6장 수납.",
    imageUrl: "https://picsum.photos/seed/wallet/400/400",
    category: "악세서리",
    stock: 25,
  },
  {
    id: "6",
    name: "LED 데스크 램프",
    price: 67000,
    description: "밝기 조절 가능한 LED 데스크 램프.",
    imageUrl: "https://picsum.photos/seed/lamp/400/400",
    category: "인테리어",
    stock: 20,
  },
];

export const mockUsers: MockUser[] = [
  {
    id: "user-1",
    email: "test@example.com",
    name: "테스트 사용자",
  },
];
