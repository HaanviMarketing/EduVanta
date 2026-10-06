import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Download,
  FileText,
  User,
  Check,
  X,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { repo } from '../../lib/storage';
import { LibraryBook, BookCirculationRecord } from '../../types';

export const LibraryManagement: React.FC = () => {
  const { currentTenant, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'catalog' | 'circulation' | 'digital'>('catalog');

  // Search & Category Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Circulation State
  const [circulationRecords, setCirculationRecords] = useState<BookCirculationRecord[]>(() =>
    currentTenant ? repo.getLibraryCirculation(currentTenant.id) : []
  );

  // Issue Book Modal
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueBookId, setIssueBookId] = useState('');
  const [issueStudentId, setIssueStudentId] = useState('');
  const [issueDueDate, setIssueDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // 14 days loan period
    return d.toISOString().split('T')[0];
  });

  // Add Book Modal
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newIsbn, setNewIsbn] = useState('');
  const [newCategory, setNewCategory] = useState<LibraryBook['category']>('Sciences');
  const [newRack, setNewRack] = useState('Rack S-01 / Shelf A');
  const [newCopies, setNewCopies] = useState(10);

  // Success Feedback
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!currentTenant) return null;

  const books = repo.getLibraryBooks(currentTenant.id);
  const students = repo.getStudents(currentTenant.id);

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.includes(searchQuery);
    const matchesCat = selectedCategory === 'all' || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const activeIssuedCount = circulationRecords.filter((c) => c.status === 'issued').length;
  const overdueCount = circulationRecords.filter((c) => c.status === 'overdue').length;
  const totalCopiesCount = books.reduce((sum, b) => sum + b.totalCopies, 0);

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    const book = books.find((b) => b.id === issueBookId);
    const student = students.find((s) => s.id === issueStudentId);
    if (!book || !student) return;

    const newRecord = repo.issueBook(
      currentTenant.id,
      {
        bookId: book.id,
        bookTitle: book.title,
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        studentClass: `Grade 10`,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: issueDueDate,
        status: 'issued',
        lateFineAmount: 0,
      },
      currentUser || undefined
    );

    setCirculationRecords(repo.getLibraryCirculation(currentTenant.id));
    setIsIssueModalOpen(false);
    setSuccessMsg(`Issued "${book.title}" to ${student.firstName} ${student.lastName} (Due: ${issueDueDate}).`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleReturnBook = (recordId: string) => {
    const rec = circulationRecords.find((c) => c.id === recordId);
    if (!rec) return;

    repo.returnBook(currentTenant.id, recordId, rec.lateFineAmount, currentUser || undefined);
    setCirculationRecords(repo.getLibraryCirculation(currentTenant.id));
    setSuccessMsg(`Book "${rec.bookTitle}" returned successfully. Copy returned to shelf.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAuthor) return;

    repo.addLibraryBook(
      currentTenant.id,
      {
        title: newTitle,
        author: newAuthor,
        isbn: newIsbn || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        accessionNo: `ACC-${newCategory.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        category: newCategory,
        rackShelfLocation: newRack,
        totalCopies: Number(newCopies),
        availableCopies: Number(newCopies),
      },
      currentUser || undefined
    );

    setIsAddBookOpen(false);
    setNewTitle('');
    setNewAuthor('');
    setNewIsbn('');
    setSuccessMsg(`Cataloged "${newTitle}" into library inventory.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-teal-800">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Library & Learning Resource Hub</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Accession cataloging, circulation desk loans, overdue fines management, and curated digital syllabus resources.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            + Issue Book
          </button>
          <button
            onClick={() => setIsAddBookOpen(true)}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catalog Book</span>
          </button>
        </div>
      </div>

      {/* Success Notification Bar */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cataloged Titles</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{books.length} Titles</div>
          <span className="text-[11px] text-teal-800 font-semibold block mt-1">
            {totalCopiesCount} physical copies on shelves
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Currently Issued</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{activeIssuedCount} Books</div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">Standard 14-day student loan period</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overdue Returns</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{overdueCount} Books</div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">₹5/day late fine applicable</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Digital Repository</span>
          <div className="text-2xl font-black text-slate-900 mt-1">42 Resources</div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">CBSE/ICSE e-books & guides</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-xl gap-6">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'catalog'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Book Catalog & Accession Register ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('circulation')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'circulation'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Circulation Desk ({circulationRecords.length})</span>
          {overdueCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
              {overdueCount} Overdue
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('digital')}
          className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'digital'
              ? 'border-teal-800 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Digital E-Books & Study Material</span>
        </button>
      </div>

      {/* Tab 1: Book Catalog */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by Title, Author or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-700"
                >
                  <option value="all">All Categories</option>
                  <option value="Sciences">Sciences</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Literature">Literature</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="History">History</option>
                  <option value="Reference">Reference</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-medium">Showing {filteredBooks.length} titles</div>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800">
                      {book.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{book.accessionNo}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{book.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">Author: {book.author}</p>

                  <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Rack Location:</span>
                      <span className="font-semibold text-slate-800">{book.rackShelfLocation}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>ISBN:</span>
                      <span className="font-mono text-slate-700">{book.isbn}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        book.availableCopies > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                    <span className="font-bold text-slate-800">
                      {book.availableCopies} of {book.totalCopies} Available
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setIssueBookId(book.id);
                      setIsIssueModalOpen(true);
                    }}
                    disabled={book.availableCopies === 0}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      book.availableCopies > 0
                        ? 'bg-teal-800 hover:bg-teal-700 text-white cursor-pointer shadow-2xs'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Issue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Circulation Desk */}
      {activeTab === 'circulation' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Book Title</th>
                  <th className="py-3 px-4">Borrower Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Loan Status</th>
                  <th className="py-3 px-4">Late Fine</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {circulationRecords.map((circ) => {
                  const isOverdue = circ.status === 'overdue';
                  const isReturned = circ.status === 'returned';

                  return (
                    <tr key={circ.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{circ.bookTitle}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{circ.studentName}</td>
                      <td className="py-3 px-4">{circ.studentClass}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{circ.issueDate}</td>
                      <td
                        className={`py-3 px-4 font-mono text-[11px] font-semibold ${
                          isOverdue ? 'text-rose-600' : 'text-slate-700'
                        }`}
                      >
                        {circ.dueDate}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isReturned
                              ? 'bg-slate-100 text-slate-600'
                              : isOverdue
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {circ.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {circ.lateFineAmount > 0 ? `₹${circ.lateFineAmount}` : '₹0'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!isReturned ? (
                          <button
                            onClick={() => handleReturnBook(circ.id)}
                            className="px-2.5 py-1 bg-teal-800 hover:bg-teal-700 text-white rounded text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Return Book
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Returned</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Digital E-Books */}
      {activeTab === 'digital' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { title: 'Grade 10 Mathematics Complete Exemplar', type: 'PDF Handbook', size: '14.2 MB', downloads: 342, subject: 'Mathematics' },
            { title: 'CBSE Physics Lab Manual & Experiments', type: 'Laboratory Guide', size: '8.7 MB', downloads: 289, subject: 'Physics' },
            { title: 'Organic & Inorganic Chemistry Revision Notes', type: 'Short Notes', size: '5.4 MB', downloads: 410, subject: 'Chemistry' },
            { title: 'English Literature Sample Analytical Essays', type: 'Study Guide', size: '3.1 MB', downloads: 195, subject: 'English' },
            { title: 'Computer Science Python Algorithms Workbook', type: 'Workbook', size: '12.0 MB', downloads: 312, subject: 'Computer Science' },
            { title: 'Indian History & Contemporary World Vol II', type: 'Textbook PDF', size: '24.5 MB', downloads: 156, subject: 'Social Sciences' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] uppercase font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  {item.subject}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{item.size}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
              <p className="text-xs text-slate-500">{item.type} &bull; {item.downloads} Student Downloads</p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold text-[11px]">Free Campus Access</span>
                <button
                  onClick={() => alert(`Simulating download of ${item.title}`)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Issue Book Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Issue Library Book</span>
              </div>
              <button onClick={() => setIsIssueModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIssueBook} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Select Book Title *
                </label>
                <select
                  value={issueBookId}
                  onChange={(e) => setIssueBookId(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option value="">-- Choose Book from Catalog --</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.availableCopies === 0}>
                      {b.title} ({b.availableCopies} available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Select Borrower Student *
                </label>
                <select
                  value={issueStudentId}
                  onChange={(e) => setIssueStudentId(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.firstName} {st.lastName} (Roll: {st.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Return Due Date (14 Days) *
                </label>
                <input
                  type="date"
                  required
                  value={issueDueDate}
                  onChange={(e) => setIssueDueDate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Issue Book</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Catalog New Book Modal */}
      {isAddBookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Catalog Book Accession</span>
              </div>
              <button onClick={() => setIsAddBookOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBook} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fundamentals of Physics"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Author(s) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Halliday, Resnick, Walker"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Sciences">Sciences</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Literature">Literature</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="History">History</option>
                    <option value="Reference">Reference</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Total Copies
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newCopies}
                    onChange={(e) => setNewCopies(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    Rack & Shelf Location
                  </label>
                  <input
                    type="text"
                    placeholder="Rack S-03 / Shelf B"
                    value={newRack}
                    onChange={(e) => setNewRack(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                    ISBN (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="978-0471216437"
                    value={newIsbn}
                    onChange={(e) => setNewIsbn(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBookOpen(false)}
                  className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save to Accession</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
