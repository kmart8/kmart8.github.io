export interface Book {
  title: string;
  starred?: boolean;
}

export interface ReadingYear {
  year: number;
  books: Book[];
}

export const readingData: ReadingYear[] = [
  {
    year: 2025,
    books: [
      { title: "Designing Data-Intensive Applications" },
      { title: "Chip War" },
      { title: "Dune" },
      { title: "The Black Swan" },
    ]
  },
  {
    year: 2024,
    books: [
      { title: "Sapiens", starred: true },
      { title: "Homo Deus" },
      { title: "The 48 Laws of Power" },
      { title: "Supercommunicators" },
      { title: "Principles for Dealing with the Changing World Order" },
    ]
  },
  {
    year: 2023,
    books: [
      { title: "Everybody Lies: Big Data, New Data, and What the Internet Can Tell Us About Who We Really Are", starred: true },
      { title: "Principles", starred: true }
    ]
  }
];
