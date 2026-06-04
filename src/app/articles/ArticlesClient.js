'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { journals } from '@/lib/data';

export default function ArticlesClient({ initialArticles }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJournal, setSelectedJournal] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  
  const filterTabs = [
    { id: 'All', acronym: 'All Journals' },
    ...journals
  ];

  const filteredArticles = useMemo(() => {
    const filtered = initialArticles.filter(art => {
      // 1. Journal Filter
      if (selectedJournal !== 'All' && art.journal_id.toLowerCase() !== selectedJournal.toLowerCase()) {
        return false;
      }
      
      // 2. Search Filter (title, authors)
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const titleMatch = art.title?.toLowerCase().includes(query);
        const authorMatch = art.authors?.toLowerCase().includes(query);
        if (!titleMatch && !authorMatch) {
          return false;
        }
      }
      
      return true;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.published_date).getTime();
      const dateB = new Date(b.published_date).getTime();
      if (sortOrder === 'newest') return dateB - dateA;
      if (sortOrder === 'oldest') return dateA - dateB;
      return 0;
    });
  }, [initialArticles, searchTerm, selectedJournal, sortOrder]);

  return (
    <div className="space-y-6">
      {/* ── SIMPLE SEARCH & FILTER BAR ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-[400px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {filterTabs.map(tab => {
            const isActive = selectedJournal === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedJournal(tab.id)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  isActive
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tab.acronym || tab.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── RESULTS HEADER ── */}
      <div className="flex justify-between items-center text-sm pb-2 border-b border-gray-200">
        <span className="text-gray-700 font-medium">{filteredArticles.length} results found</span>
        <div className="flex items-center gap-2 text-gray-500">
          <span>Sort by:</span>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="text-gray-800 font-medium bg-transparent border-none focus:outline-none cursor-pointer p-0"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* ── ARTICLES LIST ── */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-md border border-dashed border-gray-300">
            <p className="text-gray-500">No articles match your search.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedJournal('All'); }}
              className="mt-2 text-blue-600 text-sm hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredArticles.map((art) => {
            const journal = journals.find(j => j.id.toLowerCase() === art.journal_id.toLowerCase());
            const date = new Date(art.published_date);
            const year = date.getFullYear();
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${year}`;
            
            const doi = `https://doi.org/10.63180/${art.journal_id}.eisr.${year}.1.${art.id}`;

            return (
              <div key={art.id} className="bg-white p-6 border border-gray-200 rounded-md flex flex-col gap-3">
                <Link href={`/articles/${art.id}`} className="block">
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 hover:underline">
                    {art.title}
                  </h3>
                </Link>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium text-gray-800">Authors:</span> {art.authors || 'Unknown'}</p>
                  <p><span className="font-medium text-gray-800">Journal:</span> {journal ? journal.title : art.journal_id}</p>
                  <p><span className="font-medium text-gray-800">Published:</span> {formattedDate}</p>
                </div>

                <div className="pt-2">
                  <a href={doi} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    DOI: {doi}
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
