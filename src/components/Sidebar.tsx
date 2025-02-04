"use client";

import Link from "next/link";
import React from "react";

interface SidebarProps {
  surveyId: string;
  pages: { id: number; title: string }[];
  currentPageId: string;
}

const Sidebar: React.FC<SidebarProps> = ({ surveyId, pages, currentPageId }) => {
  return (
    <aside className="w-64 p-4 border-r">
      <h2 className="text-xl font-bold mb-4">Pages</h2>
      <ul>
        {pages.map((page) => (
          <li key={page.id} className={`mb-2 ${currentPageId === String(page.id) ? "font-bold" : ""}`}>
            <Link href={`/survey/${surveyId}/page/${page.id}`}>
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
