
import React from 'react';

interface BigIdeaModalProps {
  onClose: () => void;
}

const BigIdeaModal: React.FC<BigIdeaModalProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-3xl font-bold text-purple-600 mb-4 text-center">רעיון מתמטי חשוב</h2>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">האם כפל תמיד מגדיל?</h3>
                
                <div className="space-y-4 text-lg text-gray-700">
                    <p>
                        למדנו שכפל הוא בעצם "חיבור חוזר", למשל <span className="font-semibold">3 × 4</span> זה כמו <span className="font-semibold">4 + 4 + 4</span>. התוצאה (12) גדולה יותר מ-4. אבל האם זה תמיד נכון?
                    </p>
                    <p>
                        כשכופלים בשבר קטן מ-1, זה כמו לקחת "חלק" מהמספר. התוצאה תהיה קטנה יותר!
                    </p>
                    <ul className="list-disc list-inside space-y-2 bg-purple-50 p-4 rounded-lg">
                        <li>
                            <strong className="text-blue-600">כפל במספר גדול מ-1:</strong> התוצאה גדלה.
                            <br/> <span className="text-sm text-gray-600">דוגמה: <code dir="ltr">10 × 2 = 20</code></span>
                        </li>
                        <li>
                            <strong className="text-green-600">כפל ב-1:</strong> התוצאה נשארת זהה.
                            <br/> <span className="text-sm text-gray-600">דוגמה: <code dir="ltr">10 × 1 = 10</code></span>
                        </li>
                        <li>
                            <strong className="text-red-600">כפל בשבר (בין 0 ל-1):</strong> התוצאה קטנה.
                            <br/> <span className="text-sm text-gray-600">דוגמה: <code dir="ltr">10 × 1/2 = 5</code> (חצי מ-10 הוא 5)</span>
                        </li>
                    </ul>
                    <p>
                        אז כפל לא תמיד מגדיל. זה תלוי במספר שבו אנחנו כופלים!
                    </p>
                </div>
                <div className="mt-6 text-center">
                    <button 
                        onClick={onClose}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
                    >
                        הבנתי, נמשיך!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BigIdeaModal;
