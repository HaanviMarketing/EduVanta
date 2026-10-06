import React from 'react';
import { Printer, X, Shield, Award, CheckCircle2, Building } from 'lucide-react';
import { Tenant, Student, CertificateRecord } from '../../types';

interface CertificatePrintModalProps {
  certificate: CertificateRecord;
  tenant: Tenant;
  student?: Student;
  onClose: () => void;
}

export const CertificatePrintModal: React.FC<CertificatePrintModalProps> = ({
  certificate,
  tenant,
  student,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const getCertificateTitle = () => {
    switch (certificate.type) {
      case 'transfer_certificate':
        return 'TRANSFER CERTIFICATE / SCHOOL LEAVING CERTIFICATE';
      case 'bonafide_certificate':
        return 'BONAFIDE STUDENT CERTIFICATE';
      case 'character_certificate':
        return 'CHARACTER & CONDUCT CERTIFICATE';
      case 'fee_tax_80c':
        return 'ANNUAL TUITION FEE TAX CERTIFICATE (SECTION 80C)';
      default:
        return 'OFFICIAL INSTITUTIONAL CERTIFICATE';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar (Hidden during Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-400" />
            <span className="font-bold text-xs">
              Official Document Preview &bull; {certificate.certificateNo}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Document</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Page */}
        <div className="p-8 sm:p-12 bg-[#fffdf9] text-slate-900 font-serif relative border-8 border-double border-slate-800 m-4 shadow-inner">
          {/* Institutional Watermark Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <Building className="w-96 h-96 text-slate-900" />
          </div>

          {/* School Header */}
          <div className="text-center border-b-2 border-slate-800 pb-5 mb-6 relative z-10">
            <div className="flex justify-between items-center text-[10px] font-sans font-bold text-slate-600 uppercase tracking-widest px-2 mb-2">
              <span>Affiliation No: 2130042</span>
              <span>School Code: 08241</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 font-serif">
              {tenant.name}
            </h1>
            <p className="text-xs text-slate-700 font-sans mt-1">
              Affiliated with the Central Board of Secondary Education (CBSE), New Delhi &bull; Senior Secondary
            </p>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
              Sector 12, RK Puram Institutional Area, New Delhi &bull; Ph: +91 11 2617 0000 &bull; Web: {tenant.slug}.edu
            </p>

            <div className="mt-4 inline-block px-6 py-1.5 border-2 border-slate-900 bg-amber-50/60 text-slate-900 font-black text-xs sm:text-sm tracking-wider uppercase font-sans">
              {getCertificateTitle()}
            </div>
          </div>

          {/* Serial & Date Bar */}
          <div className="flex justify-between items-center text-xs font-sans font-semibold text-slate-700 mb-6 px-1">
            <div>
              <span>Certificate / Sl. No: </span>
              <span className="font-mono font-bold text-slate-950 text-sm">{certificate.certificateNo}</span>
            </div>
            <div>
              <span>Admission / SR No: </span>
              <span className="font-mono font-bold text-slate-950">{certificate.admissionNo}</span>
            </div>
            <div>
              <span>Date of Issue: </span>
              <span className="font-bold text-slate-950">{certificate.issueDate}</span>
            </div>
          </div>

          {/* Document Body: TYPE 1 - TRANSFER CERTIFICATE */}
          {certificate.type === 'transfer_certificate' && (
            <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-800 font-sans">
              <div className="grid grid-cols-1 divide-y divide-slate-200 border border-slate-300 rounded-md overflow-hidden bg-white/70">
                {[
                  { num: '1.', label: "Name of the Pupil", val: certificate.studentName },
                  { num: '2.', label: "Mother's Name", val: student?.parentGuardian.motherName || 'Mrs. Sunita Patel' },
                  { num: '3.', label: "Father's / Guardian's Name", val: student?.parentGuardian.fatherName || 'Mr. Rajesh Patel' },
                  { num: '4.', label: "Nationality", val: 'Indian' },
                  { num: '5.', label: "Whether candidate belongs to SC / ST / OBC / General", val: 'General' },
                  { num: '6.', label: "Date of first admission in the school with class", val: '12-04-2022 in Class VIII (Eighth)' },
                  { num: '7.', label: "Date of Birth according to Admission Register", val: '14-08-2010 (Fourteenth August Two Thousand Ten)' },
                  { num: '8.', label: "Class in which the pupil last studied", val: `${certificate.studentClass} (Tenth)` },
                  { num: '9.', label: "School / Board Annual Examination last taken with result", val: 'Passed Term 1 Examination' },
                  { num: '10.', label: "Whether qualified for promotion to higher class", val: certificate.promotedToNextClass ? 'Yes, Promoted' : 'Not Applicable (Mid-term)' },
                  { num: '11.', label: "Month up to which the pupil has paid school dues", val: certificate.duesClearedMonth || 'All dues cleared up to date' },
                  { num: '12.', label: "Total number of working days in the academic session", val: '184 Days' },
                  { num: '13.', label: "Total number of working days pupil present in school", val: `${student?.attendancePercentage || 92}% Attendance Recorded` },
                  { num: '14.', label: "General conduct of the pupil", val: certificate.conduct },
                  { num: '15.', label: "Reason for leaving the school", val: certificate.reasonForLeaving || certificate.purpose },
                ].map((row) => (
                  <div key={row.num} className="flex py-2 px-3 hover:bg-slate-50">
                    <span className="w-8 font-bold text-slate-500">{row.num}</span>
                    <span className="w-1/2 font-medium text-slate-700">{row.label}:</span>
                    <span className="w-1/2 font-bold text-slate-950">{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Body: TYPE 2 - BONAFIDE CERTIFICATE */}
          {certificate.type === 'bonafide_certificate' && (
            <div className="py-8 px-4 text-sm sm:text-base leading-loose text-slate-900 font-serif space-y-6 text-justify">
              <p>
                This is to officially certify that <span className="font-bold underline uppercase">{certificate.studentName}</span>,
                son/daughter of <span className="font-bold">{student?.parentGuardian.fatherName || 'Mr. Rajesh Sharma'}</span> and{' '}
                <span className="font-bold">{student?.parentGuardian.motherName || 'Mrs. Priya Sharma'}</span>, bearing Student
                Admission Number <span className="font-mono font-bold">{certificate.admissionNo}</span>, is a regular and bona fide
                student of this institution studying in <span className="font-bold">{certificate.studentClass}</span> during the
                Academic Year <span className="font-bold">{certificate.academicYear}</span>.
              </p>

              <p>
                According to the official school admission register, his/her recorded Date of Birth is{' '}
                <span className="font-bold font-sans">14-08-2010</span>. To the best of our knowledge and institutional records,
                he/she bears an <span className="font-bold">{certificate.conduct}</span> moral character and exemplary citizenship.
              </p>

              <p>
                This certificate is issued on the specific request of the parent/guardian for the stated purpose of:{' '}
                <span className="font-bold italic underline">{certificate.purpose}</span>.
              </p>
            </div>
          )}

          {/* Document Body: TYPE 3 - CHARACTER CERTIFICATE */}
          {certificate.type === 'character_certificate' && (
            <div className="py-8 px-4 text-sm sm:text-base leading-loose text-slate-900 font-serif space-y-6 text-justify">
              <p>
                This is to certify that <span className="font-bold underline uppercase">{certificate.studentName}</span>, Admission
                No. <span className="font-mono font-bold">{certificate.admissionNo}</span>, has been a bonafide student of{' '}
                <span className="font-bold">{tenant.name}</span> from Academic Year 2022 to 2026.
              </p>

              <p>
                During his/her tenure at this school, he/she has displayed <span className="font-bold">{certificate.conduct}</span>{' '}
                character, high academic integrity, and actively contributed to extracurricular and co-curricular programs. He/she
                has not participated in any disciplinary infringement or misconduct.
              </p>

              <p>
                We wish him/her the very highest success in all future academic pursuits and career endeavors.
              </p>
            </div>
          )}

          {/* Document Body: TYPE 4 - SECTION 80C TUITION FEE CERTIFICATE */}
          {certificate.type === 'fee_tax_80c' && (
            <div className="py-6 px-4 text-xs sm:text-sm leading-relaxed text-slate-900 font-sans space-y-5">
              <p className="text-justify font-serif text-sm">
                This is to certify that the following tuition fees were received towards the education of student{' '}
                <span className="font-bold underline uppercase">{certificate.studentName}</span> (Adm No:{' '}
                <span className="font-mono font-bold">{certificate.admissionNo}</span>, Class: {certificate.studentClass}) for the
                Financial Year 2026-2027 (Assessment Year 2027-2028).
              </p>

              <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Fee Component</th>
                      <th className="p-3">Period</th>
                      <th className="p-3 text-right">Eligible 80C Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-semibold">Tuition Fee (Term 1)</td>
                      <td className="p-3 text-slate-500">April 2026 - September 2026</td>
                      <td className="p-3 text-right font-mono font-bold">₹30,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Tuition Fee (Term 2)</td>
                      <td className="p-3 text-slate-500">October 2026 - March 2027</td>
                      <td className="p-3 text-right font-mono font-bold">₹30,000</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-3" colSpan={2}>
                        Total Eligible Tuition Fee under Section 80C:
                      </td>
                      <td className="p-3 text-right font-mono text-sm font-black text-teal-900">₹60,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                * Note: Under Section 80C of the Income Tax Act, 1961, deduction is allowable exclusively for tuition fees paid for
                full-time education in India. Transportation, laboratory, and capitation fees are excluded.
              </p>
            </div>
          )}

          {/* Official Signatures & Seal Section */}
          <div className="mt-12 pt-8 border-t border-slate-300 grid grid-cols-3 gap-4 text-center text-xs font-sans relative z-10">
            <div>
              <div className="h-12 flex items-end justify-center font-serif italic text-slate-600 text-sm">
                S. Sharma
              </div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-700">
                Prepared by (Clerk)
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-teal-800 flex items-center justify-center text-[9px] font-bold text-teal-900 uppercase text-center p-1 leading-tight rotate-12 bg-teal-50/50">
                Official School Seal
              </div>
              <div className="border-t border-slate-400 w-full pt-1 font-bold text-slate-700 mt-1">
                Checked by (Registrar)
              </div>
            </div>

            <div>
              <div className="h-12 flex items-end justify-center font-serif italic text-slate-600 text-sm">
                Dr. A. K. Banerjee
              </div>
              <div className="border-t border-slate-400 pt-1 font-black text-slate-900">
                Principal & Head of School
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
