import React, { createContext, useContext, useState, useEffect } from 'react';

// Interfaces for our state
export interface DocumentItem {
    id: string;
    studentId: string;
    studentName: string;
    type: 'Paspor' | 'IELTS' | 'Ijazah' | 'Rekening Koran';
    fileName: string;
    uploadedAt: string;
    uploader: string;
    status: 'Approved' | 'Under Review' | 'Rejected';
    rejectReason?: string;
    fileUrl?: string;
}

export interface CommunicationLog {
    id: string;
    staffName: string;
    date: string;
    note: string;
}

export interface UniversityApplication {
    id: string;
    universityName: string;
    program: string;
    intake: string;
    status: 'Inquiry' | 'Prep' | 'Submitted' | 'LoA Received' | 'Visa Processing' | 'Enrolled' | 'Cancelled';
    loaUrl?: string;
}

export interface Student {
    id: string; // "STD-00X"
    name: string;
    phone: string;
    email: string;
    destinationCountry: string;
    mainUniversity: string;
    ieltsScore: number;
    gpa: number;
    status: string; // Pipeline stages
    intakeYear: string;
    photoUrl?: string;
    communicationLogs: CommunicationLog[];
    applications: UniversityApplication[];
    documents: DocumentItem[];
    // HTML specific fields
    region?: string;
    relativeName?: string;
    relativePhone?: string;
    dueDate?: string; // YYYY-MM-DD
    checklist?: {
        passport: boolean;
        ielts: boolean;
        loa: boolean;
        visa: boolean;
        sponsor: boolean;
        payment: boolean;
    };
    notes?: string[];
}

export interface PaymentItem {
    id: string;
    studentId: string;
    studentName: string;
    category: 'Application Fee' | 'Jasa Penerjemah' | 'Visa Handling' | 'Deposit Kampus';
    amount: number;
    method: 'Transfer Bank' | 'Tunai' | 'Kartu Kredit';
    status: 'Verified' | 'Pending';
    date: string;
    proofUrl?: string;
}

export interface CommissionClaim {
    id: string; // "CLM-00X"
    studentId: string;
    studentName: string;
    universityName: string;
    tuitionFee: number; // in USD
    commissionRate: number; // e.g. 10%
    estimatedCommission: number; // in USD
    status: 'Not Invoiced' | 'Invoiced' | 'Paid' | 'Cancelled';
}

export interface University {
    id: string;
    name: string;
    location: string;
    contactPerson: string;
    brochureUrl: string;
    logoUrl?: string;
    requirements: {
        ieltsMin: number;
        ieltsMinBand: number;
        gpaMin: number;
    };
    commissionScheme: string; // visible only to admin/finance
}

export interface Staff {
    id: string;
    name: string;
    email: string;
    role: 'Super Admin' | 'Counsellor' | 'Admission' | 'Finance';
    status: 'Active' | 'Inactive';
}

export interface AuditLog {
    id: string;
    staffName: string;
    role: string;
    action: string;
    objectName: string;
    time: string;
    color: string; // e.g. "emerald", "blue", "amber", "red"
}

export interface DeadlineEvent {
    id: string;
    title: string;
    studentName: string;
    universityName: string;
    country: string;
    date: string; // YYYY-MM-DD
    type: 'Document Submission' | 'Deposit Payment' | 'Visa Interview';
}

interface CrmMockContextType {
    students: Student[];
    payments: PaymentItem[];
    claims: CommissionClaim[];
    universities: University[];
    staff: Staff[];
    logs: AuditLog[];
    deadlines: DeadlineEvent[];
    pipelineStages: { id: string; label: string; color: string }[];
    countries: string[];
    documentTypes: string[];
    // Actions
    addStudent: (student: Omit<Student, 'id' | 'communicationLogs' | 'applications' | 'documents'>) => void;
    updateStudent: (id: string, updated: Partial<Student>) => void;
    updateStudentStatus: (studentId: string, newStatus: string) => void;
    addCounselingLog: (studentId: string, staffName: string, note: string) => void;
    uploadDocument: (studentId: string, type: DocumentItem['type'], fileName: string, uploader: string) => void;
    verifyDocument: (studentId: string, docId: string, status: DocumentItem['status'], rejectReason?: string) => void;
    addPayment: (payment: Omit<PaymentItem, 'id' | 'date'>) => void;
    verifyPayment: (id: string) => void;
    updateClaimStatus: (id: string, newStatus: CommissionClaim['status']) => void;
    addUniversity: (uni: University) => void;
    addStaff: (member: Omit<Staff, 'id' | 'status'>) => void;
    updateStaff: (id: string, updated: Partial<Staff>) => void;
    toggleStaffStatus: (id: string) => void;
    addLog: (staffName: string, role: string, action: string, objectName: string, color?: string) => void;
    setCountries: React.Dispatch<React.SetStateAction<string[]>>;
    addCountry: (country: string) => void;
    removeCountry: (country: string) => void;
    addDocumentType: (type: string) => void;
    removeDocumentType: (type: string) => void;
    // HTML specific state and actions
    emailQuotaUsed: number;
    emailQuotaMax: number;
    simulateEmailLoad: (amount: number) => void;
    resetEmailLoad: () => void;
    toggleStudentDocChecklist: (studentId: string, docKey: keyof NonNullable<Student['checklist']>, isChecked: boolean) => void;
    addCRMNote: (studentId: string, note: string) => void;
}

const CrmMockContext = createContext<CrmMockContextType | undefined>(undefined);

// Initial Seed Data
const DEFAULT_UNIVERSITIES: University[] = [
    {
        id: "UNI-001",
        name: "University of Oxford",
        location: "United Kingdom",
        contactPerson: "Jane Smith (int.admissions@ox.ac.uk)",
        brochureUrl: "https://www.ox.ac.uk/sites/files/oxr/prospectus.pdf",
        requirements: { ieltsMin: 7.5, ieltsMinBand: 7.0, gpaMin: 3.8 },
        commissionScheme: "10% of first-year tuition fee (Average $4,500)",
        logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&h=150&fit=crop&auto=format"
    },
    {
        id: "UNI-002",
        name: "University of Melbourne",
        location: "Australia",
        contactPerson: "David Warner (admissions@unimelb.edu.au)",
        brochureUrl: "https://www.unimelb.edu.au/brochure.pdf",
        requirements: { ieltsMin: 6.5, ieltsMinBand: 6.0, gpaMin: 3.2 },
        commissionScheme: "12% of first-year tuition fee (Average $3,800)",
        logoUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&h=150&fit=crop&auto=format"
    },
    {
        id: "UNI-003",
        name: "National University of Singapore",
        location: "Singapore",
        contactPerson: "Lim Wei (nus.global@nus.edu.sg)",
        brochureUrl: "https://nus.edu.sg/brochure.pdf",
        requirements: { ieltsMin: 7.0, ieltsMinBand: 6.5, gpaMin: 3.5 },
        commissionScheme: "8% of first-year tuition fee (Average $3,200)",
        logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=150&h=150&fit=crop&auto=format"
    },
    {
        id: "UNI-004",
        name: "Waseda University",
        location: "Japan",
        contactPerson: "Kenji Sato (waseda.admission@waseda.jp)",
        brochureUrl: "https://waseda.jp/prospectus.pdf",
        requirements: { ieltsMin: 6.0, ieltsMinBand: 5.5, gpaMin: 3.0 },
        commissionScheme: "10% flat referral fee ($2,500)",
        logoUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=150&h=150&fit=crop&auto=format"
    }
];

const DEFAULT_PIPELINE_STAGES = [
    { id: "Inquiry", label: "Lead / Inquiry", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { id: "Application Prep", label: "Application Prep", color: "bg-sky-50 text-sky-700 border-sky-200" },
    { id: "Submitted", label: "Submitted to Campus", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { id: "LoA Received", label: "LoA Received", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { id: "Visa Processing", label: "Visa Processing", color: "bg-orange-50 text-orange-700 border-orange-200" },
    { id: "Enrolled", label: "Enrolled / Departure", color: "bg-emerald-50 text-emerald-700 border-emerald-200" }
];

const DEFAULT_COUNTRIES = ["United Kingdom", "Australia", "Singapore", "Japan", "United States", "Canada"];

const INITIAL_STUDENTS: Student[] = [
    {
        id: "STD-001",
        name: "Andi Pratama",
        phone: "+628123456789",
        email: "andi.pratama@gmail.com",
        destinationCountry: "United Kingdom",
        mainUniversity: "University of Oxford",
        ieltsScore: 7.5,
        gpa: 3.85,
        status: "Submitted",
        intakeYear: "2026",
        communicationLogs: [
            { id: "log-1", staffName: "Hana Safitri (Counsellor)", date: "2026-05-10 10:00", note: "Konsultasi awal. Andi sangat berminat dengan program computer science di Oxford. Persyaratan nilai IELTS memadai." },
            { id: "log-2", staffName: "Hana Safitri (Counsellor)", date: "2026-05-12 14:30", note: "Dokumen paspor dan transkrip nilai dikumpulkan. IELTS valid dengan skor 7.5." }
        ],
        applications: [
            { id: "app-1", universityName: "University of Oxford", program: "BSc Computer Science", intake: "Fall 2026", status: "Submitted" }
        ],
        documents: [
            { id: "doc-101", studentId: "STD-001", studentName: "Andi Pratama", type: "Paspor", fileName: "Paspor_AndiPratama.pdf", uploadedAt: "2026-05-12 14:00", uploader: "Hana Safitri (Counsellor)", status: "Approved" },
            { id: "doc-102", studentId: "STD-001", studentName: "Andi Pratama", type: "IELTS", fileName: "IELTS_Andi_7.5.pdf", uploadedAt: "2026-05-12 14:05", uploader: "Hana Safitri (Counsellor)", status: "Under Review" },
            { id: "doc-103", studentId: "STD-001", studentName: "Andi Pratama", type: "Ijazah", fileName: "Ijazah_SMA_Andi_Translated.pdf", uploadedAt: "2026-05-12 14:10", uploader: "Hana Safitri (Counsellor)", status: "Under Review" }
        ]
    },
    {
        id: "STD-002",
        name: "Siti Rahma",
        phone: "+628987654321",
        email: "siti.rahma@yahoo.com",
        destinationCountry: "Australia",
        mainUniversity: "University of Melbourne",
        ieltsScore: 6.5,
        gpa: 3.60,
        status: "LoA Received",
        intakeYear: "2026",
        communicationLogs: [
            { id: "log-3", staffName: "Hana Safitri (Counsellor)", date: "2026-04-20 11:00", note: "Tertarik mengambil Master of Business di Melbourne Uni. IPK S1 mencukupi." },
            { id: "log-4", staffName: "Budi Santoso (Admission)", date: "2026-05-02 09:15", note: "LoA Conditional diterima. Kurang bukti keuangan pendukung untuk visa." }
        ],
        applications: [
            { id: "app-2", universityName: "University of Melbourne", program: "Master of Business Administration", intake: "Spring 2026", status: "LoA Received", loaUrl: "#" }
        ],
        documents: [
            { id: "doc-201", studentId: "STD-002", studentName: "Siti Rahma", type: "Paspor", fileName: "Passport_Siti_Rahma.pdf", uploadedAt: "2026-04-22 10:00", uploader: "Hana Safitri (Counsellor)", status: "Approved" },
            { id: "doc-202", studentId: "STD-002", studentName: "Siti Rahma", type: "IELTS", fileName: "IELTS_Siti_6.5.pdf", uploadedAt: "2026-04-22 10:05", uploader: "Hana Safitri (Counsellor)", status: "Approved" },
            { id: "doc-203", studentId: "STD-002", studentName: "Siti Rahma", type: "Rekening Koran", fileName: "RekeningKoran_Siti_3Bulan.pdf", uploadedAt: "2026-05-15 15:45", uploader: "Siti Rahma (Self)", status: "Under Review" }
        ]
    },
    {
        id: "STD-003",
        name: "Budi Wijaya",
        phone: "+628771234567",
        email: "budi.wijaya@outlook.com",
        destinationCountry: "Singapore",
        mainUniversity: "National University of Singapore",
        ieltsScore: 5.5, // IELTS score low, needs attention!
        gpa: 3.12,
        status: "Application Prep",
        intakeYear: "2026",
        communicationLogs: [
            { id: "log-5", staffName: "Hana Safitri (Counsellor)", date: "2026-05-01 13:00", note: "Konsultasi awal. Berminat ke NUS, namun skor IELTS 5.5 di bawah kriteria minimum NUS (7.0). Disarankan retake IELTS segera atau mengambil pre-sessional English." }
        ],
        applications: [
            { id: "app-3", universityName: "National University of Singapore", program: "BSc Business Analytics", intake: "Fall 2026", status: "Prep" }
        ],
        documents: [
            { id: "doc-301", studentId: "STD-003", studentName: "Budi Wijaya", type: "Paspor", fileName: "Paspor_Budi_Wijaya_Baru.pdf", uploadedAt: "2026-05-05 11:30", uploader: "Hana Safitri (Counsellor)", status: "Approved" },
            { id: "doc-302", studentId: "STD-003", studentName: "Budi Wijaya", type: "IELTS", fileName: "IELTS_Budi_5.5_Failed.pdf", uploadedAt: "2026-05-05 11:35", uploader: "Hana Safitri (Counsellor)", status: "Rejected", rejectReason: "Skor IELTS (5.5) tidak memenuhi syarat minimum NUS (7.0). Butuh sertifikat terbaru." }
        ]
    },
    {
        id: "STD-004",
        name: "Rani Lestari",
        phone: "+628198765432",
        email: "rani.lestari@gmail.com",
        destinationCountry: "United Kingdom",
        mainUniversity: "University of Oxford",
        ieltsScore: 8.0,
        gpa: 3.90,
        status: "Visa Processing",
        intakeYear: "2026",
        communicationLogs: [
            { id: "log-6", staffName: "Hana Safitri (Counsellor)", date: "2026-03-15 09:00", note: "Rani memiliki portofolio akademis yang luar biasa. IELTS 8.0 dan IPK 3.90. Sangat percaya diri mendaftar ke Oxford." },
            { id: "log-7", staffName: "Budi Santoso (Admission)", date: "2026-04-18 16:00", note: "LoA Unconditional diterima dari Oxford. Mulai proses pengumpulan berkas visa UK." }
        ],
        applications: [
            { id: "app-4", universityName: "University of Oxford", program: "MSc Environmental Change", intake: "Fall 2026", status: "Visa Processing" }
        ],
        documents: [
            { id: "doc-401", studentId: "STD-004", studentName: "Rani Lestari", type: "Paspor", fileName: "Paspor_Rani_Valid.pdf", uploadedAt: "2026-03-20 10:00", uploader: "Hana Safitri (Counsellor)", status: "Approved" },
            { id: "doc-402", studentId: "STD-004", studentName: "Rani Lestari", type: "IELTS", fileName: "IELTS_Rani_8.0.pdf", uploadedAt: "2026-03-20 10:05", uploader: "Hana Safitri (Counsellor)", status: "Approved" },
            { id: "doc-403", studentId: "STD-004", studentName: "Rani Lestari", type: "Rekening Koran", fileName: "FinancialProof_Rani_BankMandiri.pdf", uploadedAt: "2026-05-14 13:20", uploader: "Budi Santoso (Admission)", status: "Approved" }
        ]
    },
    {
        id: "STD-005",
        name: "Hadi Saputra",
        phone: "+628112233445",
        email: "hadi.saputra@outlook.co.id",
        destinationCountry: "Japan",
        mainUniversity: "Waseda University",
        ieltsScore: 7.0,
        gpa: 3.45,
        status: "Enrolled",
        intakeYear: "2026",
        communicationLogs: [
            { id: "log-8", staffName: "Hana Safitri (Counsellor)", date: "2026-02-10 10:30", note: "Hadi menyukai kultur Jepang dan mendaftar Waseda School of International Studies." },
            { id: "log-9", staffName: "Budi Santoso (Admission)", date: "2026-05-01 10:00", note: "Visa disetujui Kedubes Jepang. Tiket keberangkatan dikonfirmasi untuk September 2026." }
        ],
        applications: [
            { id: "app-5", universityName: "Waseda University", program: "BA International Studies", intake: "Fall 2026", status: "Enrolled" }
        ],
        documents: [
            { id: "doc-501", studentId: "STD-005", studentName: "Hadi Saputra", type: "Paspor", fileName: "Paspor_Hadi_Saputra.pdf", uploadedAt: "2026-02-12 11:00", uploader: "Hana Safitri (Counsellor)", status: "Approved" },
            { id: "doc-502", studentId: "STD-005", studentName: "Hadi Saputra", type: "IELTS", fileName: "IELTS_Hadi_7.0.pdf", uploadedAt: "2026-02-12 11:05", uploader: "Hana Safitri (Counsellor)", status: "Approved" }
        ]
    }
];

const INITIAL_PAYMENTS: PaymentItem[] = [
    { id: "PAY-001", studentId: "STD-001", studentName: "Andi Pratama", category: "Application Fee", amount: 1500000, method: "Transfer Bank", status: "Verified", date: "2026-05-12" },
    { id: "PAY-002", studentId: "STD-002", studentName: "Siti Rahma", category: "Jasa Penerjemah", amount: 750000, method: "Transfer Bank", status: "Verified", date: "2026-04-22" },
    { id: "PAY-003", studentId: "STD-004", studentName: "Rani Lestari", category: "Visa Handling", amount: 3500000, method: "Kartu Kredit", status: "Verified", date: "2026-05-14" },
    { id: "PAY-004", studentId: "STD-003", studentName: "Budi Wijaya", category: "Application Fee", amount: 1500000, method: "Transfer Bank", status: "Pending", date: "2026-05-17" }
];

const INITIAL_CLAIMS: CommissionClaim[] = [
    { id: "CLM-001", studentId: "STD-005", studentName: "Hadi Saputra", universityName: "Waseda University", tuitionFee: 15000, commissionRate: 10, estimatedCommission: 1500, status: "Paid" },
    { id: "CLM-002", studentId: "STD-004", studentName: "Rani Lestari", universityName: "University of Oxford", tuitionFee: 32000, commissionRate: 10, estimatedCommission: 3200, status: "Invoiced" },
    { id: "CLM-003", studentId: "STD-002", studentName: "Siti Rahma", universityName: "University of Melbourne", tuitionFee: 28000, commissionRate: 12, estimatedCommission: 3360, status: "Not Invoiced" }
];

const INITIAL_STAFF: Staff[] = [
    { id: "STF-001", name: "Rian Hidayat", email: "rian.h@crmnexus.com", role: "Super Admin", status: "Active" },
    { id: "STF-002", name: "Hana Safitri", email: "hana.s@crmnexus.com", role: "Counsellor", status: "Active" },
    { id: "STF-003", name: "Budi Santoso", email: "budi.s@crmnexus.com", role: "Admission", status: "Active" },
    { id: "STF-004", name: "Siska Amelia", email: "siska.a@crmnexus.com", role: "Finance", status: "Active" }
];

const INITIAL_LOGS: AuditLog[] = [
    { id: "log-a1", staffName: "Hana Safitri", role: "Counsellor", action: "menambahkan catatan konseling manual untuk", objectName: "Andi Pratama", time: "5 menit yang lalu", color: "emerald" },
    { id: "log-a2", staffName: "Budi Santoso", role: "Admission", action: "menyetujui berkas Paspor untuk", objectName: "Rani Lestari", time: "1 jam yang lalu", color: "blue" },
    { id: "log-a3", staffName: "Siska Amelia", role: "Finance", action: "memverifikasi pembayaran application fee", objectName: "Andi Pratama", time: "3 jam yang lalu", color: "emerald" },
    { id: "log-a4", staffName: "Hana Safitri", role: "Counsellor", action: "mengunggah dokumen IELTS baru untuk", objectName: "Budi Wijaya", time: "1 hari yang lalu", color: "amber" },
    { id: "log-a5", staffName: "Budi Santoso", role: "Admission", action: "menolak dokumen IELTS untuk", objectName: "Budi Wijaya", time: "1 hari yang lalu", color: "red" }
];

const INITIAL_DEADLINES: DeadlineEvent[] = [
    { id: "ev-1", title: "Submit Final IELTS Oxford", studentName: "Andi Pratama", universityName: "University of Oxford", country: "United Kingdom", date: "2026-05-20", type: "Document Submission" },
    { id: "ev-2", title: "Bayar Deposit Uang Kuliah Melbourne", studentName: "Siti Rahma", universityName: "University of Melbourne", country: "Australia", date: "2026-05-23", type: "Deposit Payment" },
    { id: "ev-3", title: "Wawancara Visa COE Jepang", studentName: "Hadi Saputra", universityName: "Waseda University", country: "Japan", date: "2026-05-29", type: "Visa Interview" },
    { id: "ev-4", title: "Submit Financial Documents Oxford", studentName: "Rani Lestari", universityName: "University of Oxford", country: "United Kingdom", date: "2026-06-05", type: "Document Submission" }
];

export const CrmMockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Load from localStorage or seed with defaults
    const [students, setStudents] = useState<Student[]>(() => {
        const stored = localStorage.getItem('crm_mock_students');
        return stored ? JSON.parse(stored) : INITIAL_STUDENTS;
    });

    const [payments, setPayments] = useState<PaymentItem[]>(() => {
        const stored = localStorage.getItem('crm_mock_payments');
        return stored ? JSON.parse(stored) : INITIAL_PAYMENTS;
    });

    const [claims, setClaims] = useState<CommissionClaim[]>(() => {
        const stored = localStorage.getItem('crm_mock_claims');
        return stored ? JSON.parse(stored) : INITIAL_CLAIMS;
    });

    const [universities, setUniversities] = useState<University[]>(() => {
        const stored = localStorage.getItem('crm_mock_universities');
        return stored ? JSON.parse(stored) : DEFAULT_UNIVERSITIES;
    });

    const [staff, setStaff] = useState<Staff[]>(() => {
        const stored = localStorage.getItem('crm_mock_staff');
        return stored ? JSON.parse(stored) : INITIAL_STAFF;
    });

    const [logs, setLogs] = useState<AuditLog[]>(() => {
        const stored = localStorage.getItem('crm_mock_logs');
        return stored ? JSON.parse(stored) : INITIAL_LOGS;
    });

    const [deadlines] = useState<DeadlineEvent[]>(() => {
        const stored = localStorage.getItem('crm_mock_deadlines');
        return stored ? JSON.parse(stored) : INITIAL_DEADLINES;
    });

    const [countries, setCountries] = useState<string[]>(() => {
        const stored = localStorage.getItem('crm_mock_countries');
        return stored ? JSON.parse(stored) : DEFAULT_COUNTRIES;
    });

    const [documentTypes, setDocumentTypes] = useState<string[]>(() => {
        const stored = localStorage.getItem('crm_mock_document_types');
        return stored ? JSON.parse(stored) : ["Paspor", "IELTS", "Ijazah", "Rekening Koran"];
    });

    // HTML Specific States
    const [emailQuotaUsed, setEmailQuotaUsed] = useState<number>(() => {
        const stored = localStorage.getItem('crm_mock_email_quota');
        return stored ? parseInt(stored) : 155;
    });
    const emailQuotaMax = 250;

    // Save changes to localStorage
    useEffect(() => {
        localStorage.setItem('crm_mock_students', JSON.stringify(students));
    }, [students]);

    useEffect(() => {
        localStorage.setItem('crm_mock_payments', JSON.stringify(payments));
    }, [payments]);

    useEffect(() => {
        localStorage.setItem('crm_mock_claims', JSON.stringify(claims));
    }, [claims]);

    useEffect(() => {
        localStorage.setItem('crm_mock_universities', JSON.stringify(universities));
    }, [universities]);

    useEffect(() => {
        localStorage.setItem('crm_mock_staff', JSON.stringify(staff));
    }, [staff]);

    useEffect(() => {
        localStorage.setItem('crm_mock_logs', JSON.stringify(logs));
    }, [logs]);

    useEffect(() => {
        localStorage.setItem('crm_mock_deadlines', JSON.stringify(deadlines));
    }, [deadlines]);

    useEffect(() => {
        localStorage.setItem('crm_mock_countries', JSON.stringify(countries));
    }, [countries]);

    useEffect(() => {
        localStorage.setItem('crm_mock_document_types', JSON.stringify(documentTypes));
    }, [documentTypes]);

    useEffect(() => {
        localStorage.setItem('crm_mock_email_quota', emailQuotaUsed.toString());
    }, [emailQuotaUsed]);

    // Helpers
    const addLog = (staffName: string, role: string, action: string, objectName: string, color: string = 'blue') => {
        const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            staffName,
            role,
            action,
            objectName,
            time: "Baru saja",
            color
        };
        setLogs(prev => [newLog, ...prev.slice(0, 19)]);
    };

    // Actions implementation
    const addStudent = (newS: Omit<Student, 'id' | 'communicationLogs' | 'applications' | 'documents'>) => {
        const nextId = `STD-00${students.length + 1}`;
        const student: Student = {
            ...newS,
            id: nextId,
            communicationLogs: [
                {
                    id: `log-${Date.now()}`,
                    staffName: "System",
                    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    note: `Mahasiswa terdaftar di sistem dengan tujuan ${newS.destinationCountry} - ${newS.mainUniversity}.`
                }
            ],
            applications: [
                {
                    id: `app-${Date.now()}`,
                    universityName: newS.mainUniversity,
                    program: "Bachelor/Master Degree",
                    intake: `${newS.intakeYear}`,
                    status: 'Inquiry'
                }
            ],
            documents: [
                { id: `doc-${Date.now()}-1`, studentId: nextId, studentName: newS.name, type: "Paspor", fileName: `Passport_${newS.name.replace(/\s+/g, '')}.pdf`, uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16), uploader: "System", status: "Under Review" },
                { id: `doc-${Date.now()}-2`, studentId: nextId, studentName: newS.name, type: "IELTS", fileName: `IELTS_${newS.name.replace(/\s+/g, '')}.pdf`, uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16), uploader: "System", status: "Under Review" }
            ]
        };

        setStudents(prev => [...prev, student]);
        addLog("System", "Automation", "mendaftarkan mahasiswa baru", student.name, "emerald");
    };

    const updateStudent = (id: string, updated: Partial<Student>) => {
        setStudents(prev => prev.map(s => {
            if (s.id === id) {
                const combined = { ...s, ...updated };
                // Also update student names in docs if name changed
                if (updated.name) {
                    combined.documents = combined.documents.map(d => ({ ...d, studentName: updated.name! }));
                }
                return combined;
            }
            return s;
        }));
    };

    const updateStudentStatus = (studentId: string, newStatus: string) => {
        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                const updatedLogs = [
                    ...s.communicationLogs,
                    {
                        id: `log-${Date.now()}`,
                        staffName: "Admission Staff",
                        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                        note: `Status pendaftaran diperbarui dari '${s.status}' menjadi '${newStatus}'.`
                    }
                ];

                // Update university applications state as well to match pipeline stage
                const updatedApps = s.applications.map(app => {
                    if (app.universityName === s.mainUniversity) {
                        let appStatus: UniversityApplication['status'] = 'Prep';
                        if (newStatus === 'Inquiry') appStatus = 'Inquiry';
                        if (newStatus === 'Application Prep') appStatus = 'Prep';
                        if (newStatus === 'Submitted') appStatus = 'Submitted';
                        if (newStatus === 'LoA Received') appStatus = 'LoA Received';
                        if (newStatus === 'Visa Processing') appStatus = 'Visa Processing';
                        if (newStatus === 'Enrolled') appStatus = 'Enrolled';
                        return { ...app, status: appStatus };
                    }
                    return app;
                });

                // Trigger commission claim creation automatically if status is Enrolled
                if (newStatus === 'Enrolled') {
                    // Check if claim already exists
                    const exists = claims.some(c => c.studentId === studentId);
                    if (!exists) {
                        const nextClaimId = `CLM-00${claims.length + 1}`;
                        const estCom = Math.round(25000 * 0.1); // Mock tuition fee $25000 with 10% rate
                        const newClaim: CommissionClaim = {
                            id: nextClaimId,
                            studentId: s.id,
                            studentName: s.name,
                            universityName: s.mainUniversity,
                            tuitionFee: 25000,
                            commissionRate: 10,
                            estimatedCommission: estCom,
                            status: 'Not Invoiced'
                        };
                        setClaims(cPrev => [...cPrev, newClaim]);
                        addLog("System", "Finance", "membuat klaim komisi otomatis (Enrolled) untuk", s.name, "emerald");
                    }
                }

                return { ...s, status: newStatus, communicationLogs: updatedLogs, applications: updatedApps };
            }
            return s;
        }));

        const sObj = students.find(s => s.id === studentId);
        if (sObj) {
            addLog("Staff Admin", "Operational", `memindahkan status pipeline ${sObj.name} ke`, newStatus, "blue");
        }
    };

    const addCounselingLog = (studentId: string, staffName: string, note: string) => {
        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                return {
                    ...s,
                    communicationLogs: [
                        ...s.communicationLogs,
                        {
                            id: `log-${Date.now()}`,
                            staffName,
                            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                            note
                        }
                    ]
                };
            }
            return s;
        }));
        const sObj = students.find(s => s.id === studentId);
        if (sObj) {
            addLog(staffName, "Counsellor", "menambahkan catatan konseling manual untuk", sObj.name, "emerald");
        }
    };

    const uploadDocument = (studentId: string, type: DocumentItem['type'], fileName: string, uploader: string) => {
        const newDoc: DocumentItem = {
            id: `doc-${Date.now()}`,
            studentId,
            studentName: students.find(s => s.id === studentId)?.name || "Unknown",
            type,
            fileName,
            uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            uploader,
            status: 'Under Review'
        };

        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                return {
                    ...s,
                    documents: [...s.documents, newDoc]
                };
            }
            return s;
        }));

        addLog(uploader, "System", `mengunggah berkas ${type} untuk`, newDoc.studentName, "blue");
    };

    const verifyDocument = (studentId: string, docId: string, status: DocumentItem['status'], rejectReason?: string) => {
        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                const updatedDocs = s.documents.map(d => {
                    if (d.id === docId) {
                        return { ...d, status, rejectReason };
                    }
                    return d;
                });
                return { ...s, documents: updatedDocs };
            }
            return s;
        }));

        const sObj = students.find(s => s.id === studentId);
        const dObj = sObj?.documents.find(d => d.id === docId);
        if (sObj && dObj) {
            const actionText = status === 'Approved' ? 'menyetujui' : status === 'Rejected' ? 'menolak' : 'meninjau ulang';
            const col = status === 'Approved' ? 'emerald' : status === 'Rejected' ? 'red' : 'amber';
            addLog("Budi Santoso", "Admission", `${actionText} dokumen ${dObj.type} milik`, sObj.name, col);
        }
    };

    const addPayment = (payment: Omit<PaymentItem, 'id' | 'date'>) => {
        const newPay: PaymentItem = {
            ...payment,
            id: `PAY-00${payments.length + 1}`,
            date: new Date().toISOString().substring(0, 10)
        };
        setPayments(prev => [...prev, newPay]);
        addLog("Finance Staff", "Finance", "mencatat pembayaran baru untuk", payment.studentName, "emerald");
    };

    const verifyPayment = (id: string) => {
        setPayments(prev => prev.map(p => {
            if (p.id === id) {
                return { ...p, status: 'Verified' };
            }
            return p;
        }));
        const pObj = payments.find(p => p.id === id);
        if (pObj) {
            addLog("Siska Amelia", "Finance", "memverifikasi pembayaran lunas untuk", pObj.studentName, "emerald");
        }
    };

    const updateClaimStatus = (id: string, newStatus: CommissionClaim['status']) => {
        setClaims(prev => prev.map(c => {
            if (c.id === id) {
                return { ...c, status: newStatus };
            }
            return c;
        }));
        const cObj = claims.find(c => c.id === id);
        if (cObj) {
            const actionText = newStatus === 'Paid' ? 'mencairkan' : newStatus === 'Invoiced' ? 'mengirim invoice' : 'membatalkan';
            const col = newStatus === 'Paid' ? 'emerald' : newStatus === 'Invoiced' ? 'amber' : 'red';
            addLog("Siska Amelia", "Finance", `${actionText} komisi dari ${cObj.universityName} untuk`, cObj.studentName, col);
        }
    };

    const addUniversity = (uni: University) => {
        setUniversities(prev => [...prev, uni]);
        addLog("Rian Hidayat", "Super Admin", "menambahkan universitas mitra baru:", uni.name, "emerald");
    };

    const addStaff = (member: Omit<Staff, 'id' | 'status'>) => {
        const newStaff: Staff = {
            ...member,
            id: `STF-00${staff.length + 1}`,
            status: 'Active'
        };
        setStaff(prev => [...prev, newStaff]);
        addLog("Rian Hidayat", "Super Admin", "menambahkan staf internal baru:", member.name, "emerald");
    };

    const toggleStaffStatus = (id: string) => {
        setStaff(prev => prev.map(s => {
            if (s.id === id) {
                const nextStatus = s.status === 'Active' ? 'Inactive' : 'Active';
                return { ...s, status: nextStatus };
            }
            return s;
        }));
    };

    const addCountry = (c: string) => {
        setCountries(prev => [...prev, c]);
        addLog("System", "Configuration", "menambahkan negara tujuan baru:", c, "emerald");
    };

    const removeCountry = (c: string) => {
        setCountries(prev => prev.filter(x => x !== c));
        addLog("System", "Configuration", "menghapus negara tujuan:", c, "red");
    };

    const addDocumentType = (t: string) => {
        setDocumentTypes(prev => [...prev, t]);
        addLog("System", "Configuration", "menambahkan syarat berkas baru:", t, "emerald");
    };

    const removeDocumentType = (t: string) => {
        setDocumentTypes(prev => prev.filter(x => x !== t));
        addLog("System", "Configuration", "menghapus syarat berkas:", t, "red");
    };

    const updateStaff = (id: string, updated: Partial<Staff>) => {
        setStaff(prev => prev.map(s => {
            if (s.id === id) {
                return { ...s, ...updated };
            }
            return s;
        }));
        const sObj = staff.find(s => s.id === id);
        if (sObj) {
            addLog("System", "Super Admin", `memperbarui profil staf ${sObj.name}`, updated.role || "", "blue");
        }
    };

    // HTML Specific Actions
    const simulateEmailLoad = (amount: number) => {
        setEmailQuotaUsed(prev => {
            let next = prev + amount;
            if (next > emailQuotaMax) next = emailQuotaMax;
            return next;
        });
    };

    const resetEmailLoad = () => {
        setEmailQuotaUsed(120); // Reset to some baseline
    };

    const toggleStudentDocChecklist = (studentId: string, docKey: keyof NonNullable<Student['checklist']>, isChecked: boolean) => {
        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                const currentChecklist = s.checklist || { passport: false, ielts: false, loa: false, visa: false, sponsor: false, payment: false };
                const newChecklist = { ...currentChecklist, [docKey]: isChecked };
                
                // Auto transition logic if 100% complete
                const keys = Object.keys(newChecklist) as Array<keyof NonNullable<Student['checklist']>>;
                const complete = keys.every(k => newChecklist[k]);
                const nextStatus = complete ? 'Enrolled' : s.status;

                return { ...s, checklist: newChecklist, status: nextStatus };
            }
            return s;
        }));
    };

    const addCRMNote = (studentId: string, note: string) => {
        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                return { ...s, notes: [note, ...(s.notes || [])] };
            }
            return s;
        }));
    };

    return (
        <CrmMockContext.Provider value={{
            students,
            payments,
            claims,
            universities,
            staff,
            logs,
            deadlines,
            pipelineStages: DEFAULT_PIPELINE_STAGES,
            countries,
            documentTypes,
            addStudent,
            updateStudent,
            updateStudentStatus,
            addCounselingLog,
            uploadDocument,
            verifyDocument,
            addPayment,
            verifyPayment,
            updateClaimStatus,
            addUniversity,
            addStaff,
            updateStaff,
            toggleStaffStatus,
            addLog,
            setCountries,
            addCountry,
            removeCountry,
            addDocumentType,
            removeDocumentType,
            emailQuotaUsed,
            emailQuotaMax,
            simulateEmailLoad,
            resetEmailLoad,
            toggleStudentDocChecklist,
            addCRMNote
        }}>
            {children}
        </CrmMockContext.Provider>
    );
};

export const useCrmMock = () => {
    const context = useContext(CrmMockContext);
    if (context === undefined) {
        throw new Error('useCrmMock must be used within a CrmMockProvider');
    }
    return context;
};
