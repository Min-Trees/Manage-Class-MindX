import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDyW_CN4vk5zkph0_27tZg34yANPRPPCao",
  authDomain: "mindx-c885c.firebaseapp.com",
  projectId: "mindx-c885c",
  storageBucket: "mindx-c885c.firebasestorage.app",
  messagingSenderId: "896319817222",
  appId: "1:896319817222:web:29147106706d45d37ae587",
  measurementId: "G-YG4E6HWWE3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
let isAdmin = false;

        // Dữ liệu mẫu và biến toàn cục
        let data = {};
        let classInfo = {};
        let currentClass = '';
        let currentStudent = '';
        let editingProductIndex = -1;
        let pendingImportData = null;
        let searchResults = [];

async function saveToFirebase() {
    try {
        await setDoc(doc(db, 'management', 'data'), { data, classInfo });
    } catch (err) {
        console.error('Firebase save error', err);
    }
}

async function loadFromFirebase() {
    try {
        const snap = await getDoc(doc(db, 'management', 'data'));
        if (snap.exists()) {
            const saved = snap.data();
            data = saved.data || {};
            classInfo = saved.classInfo || {};
        }
    } catch (err) {
        console.error('Firebase load error', err);
    }
}

function requireAdmin() {
    if (!isAdmin) {
        alert('Chỉ admin mới được phép thực hiện thao tác này');
        return false;
    }
    return true;
}

function showLoginModal() {
    document.getElementById('login-modal').style.display = 'block';
}

function loginAdmin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then(() => closeModal('login-modal'))
        .catch(() => alert('Đăng nhập thất bại'));
}

function logout() {
    signOut(auth);
}

onAuthStateChanged(auth, user => {
    isAdmin = !!user;
    updateAdminUI();
});

function updateAdminUI() {
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = isAdmin ? '' : 'none';
    });
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    if (loginBtn && logoutBtn) {
        loginBtn.style.display = isAdmin ? 'none' : '';
        logoutBtn.style.display = isAdmin ? '' : 'none';
    }
}


        const FEEDBACK_CRITERIA = {
            coding: {
                learning: {
                    label: 'Khả năng học tập',
                    samples: [
                        'Trong buổi học hôm nay con tập trung khá tốt, tương tác tốt với thầy để xây dựng bài giảng, trong quá trình học con nên chủ động hơn khi chưa hiểu hoặc gặp sai sót. Con tiếp thu được kiến thức trong buổi học.',
                        'Con tập trung nghe giảng và tham gia xây dựng bài.',
                        'Con cần tập trung hơn và mạnh dạn hỏi khi chưa hiểu.'
                    ]
                },
                programming: {
                    label: 'Khả năng lập trình',
                    samples: [
                        'Con lập trình được cú pháp cơ bản của List, trong quá trình lập trình con cần kiểm tra kĩ hơn để tránh bị sai lỗi cú pháp ( chính tả), trong quá trình làm bài tập con cần phân tích kĩ hơn, con hoàn thành nội dung buổi học.',
                        'Con viết mã đúng cú pháp và biết debug lỗi cơ bản.',
                        'Con còn sai lỗi cú pháp, cần rà soát kĩ trước khi chạy.'
                    ]
                },
                application: {
                    label: 'Khả năng ứng dụng',
                    samples: [
                        'Con ứng dụng được các bài tập cơ bản, đối với kiến thức mới còn còn gặp một số sai sót nhỏ và cần thầy hỗ trợ, về nhà con cố gắng ôn tập và làm bài tập để vững kiến thức hơn nhé.',
                        'Con vận dụng tốt kiến thức vào bài tập.',
                        'Con gặp khó khăn khi áp dụng kiến thức mới.'
                    ]
                },
                homework: {
                    label: 'Bài tập về nhà',
                    samples: [
                        'Con hoàn thành đầy đủ bài tập về nhà',
                        'Con chưa hoàn thành bài tập về nhà'
                    ]
                }
            },
            robotic: {
                assembly: {
                    label: 'Khả năng lắp ráp',
                    samples: [
                        'Con lắp ráp tốt, tuân thủ đúng các bước và đảm bảo sản phẩm vận hành ổn định.',
                        'Con lắp ráp được cấu trúc cơ bản nhưng cần chú ý độ chắc chắn.',
                        'Con gặp khó khăn khi lắp ráp, cần thầy hỗ trợ nhiều.'
                    ]
                },
                programming: {
                    label: 'Lập trình',
                    samples: [
                        'Con lập trình đúng theo yêu cầu, ít mắc lỗi và biết điều chỉnh khi robot chưa hoạt động như mong muốn.',
                        'Con viết chương trình chạy ổn định.',
                        'Con chưa kiểm soát được lỗi, cần luyện tập thêm.'
                    ]
                },
                attitude: {
                    label: 'Thái độ học tập',
                    samples: [
                        'Con tập trung, nghiêm túc và hoàn thành tốt nội dung buổi học.',
                        'Con học tập nghiêm túc và chú ý nghe giảng.',
                        'Con còn mất tập trung, cần cố gắng hơn.'
                    ]
                },
                teamwork: {
                    label: 'Làm việc nhóm',
                    samples: [
                        'Con làm việc nhóm tốt, hỗ trợ và phối hợp với các bạn để đạt kết quả chung.',
                        'Con phối hợp với bạn bè khá tốt.',
                        'Con còn chưa phối hợp nhịp nhàng với nhóm.'
                    ]
                }
            }
        };

        // ======================== LOCALSTORAGE FUNCTIONS ========================

        // Key để lưu trong localStorage
        const STORAGE_KEYS = {
            DATA: 'student_management_data',
            CLASS_INFO: 'student_management_class_info',
            RECENT_SEARCHES: 'student_management_recent_searches'
        };

        // Cấu hình Google Sheets (cần thay bằng thông tin thật)
        const GOOGLE_SHEET_CONFIG = {
            apiKey: 'YOUR_API_KEY',
            clientId: 'YOUR_CLIENT_ID',
            spreadsheetId: 'YOUR_SPREADSHEET_ID'
        };

        // Lưu dữ liệu vào localStorage
        function saveToLocalStorage() {
            try {
                localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(data));
                localStorage.setItem(STORAGE_KEYS.CLASS_INFO, JSON.stringify(classInfo));
                showStorageStatus('💾 Đã lưu', false);
                console.log('Dữ liệu đã được lưu vào localStorage');
                saveToFirebase();
                saveToGoogleSheet();
            } catch (error) {
                console.error('Lỗi khi lưu vào localStorage:', error);
                showStorageStatus('❌ Lỗi lưu trữ', true);
            }
        }

        // Tải dữ liệu từ localStorage
        function loadFromLocalStorage() {
            try {
                const savedData = localStorage.getItem(STORAGE_KEYS.DATA);
                const savedClassInfo = localStorage.getItem(STORAGE_KEYS.CLASS_INFO);

                if (savedData) {
                    data = JSON.parse(savedData);
                    console.log('Đã tải dữ liệu học viên từ localStorage');
                }

                if (savedClassInfo) {
                    classInfo = JSON.parse(savedClassInfo);
                    console.log('Đã tải thông tin lớp từ localStorage');
                }

                // Nếu không có dữ liệu trong localStorage, khởi tạo dữ liệu mặc định
                if (Object.keys(classInfo).length === 0) {
                    initDefaultClasses();
                    initSampleData();
                    saveToLocalStorage();
                }

                return true;
            } catch (error) {
                console.error('Lỗi khi tải từ localStorage:', error);
                showStorageStatus('❌ Lỗi tải dữ liệu', true);
                // Khởi tạo dữ liệu mặc định nếu có lỗi
                initDefaultClasses();
                initSampleData();
                return false;
            }
        }

        // Hiển thị trạng thái lưu trữ
        function showStorageStatus(message, isError = false) {
            const statusElement = document.getElementById('storage-status');
            statusElement.textContent = message;
            statusElement.className = `storage-status show ${isError ? 'error' : ''}`;

            setTimeout(() => {
                statusElement.classList.remove('show');
            }, 2000);
        }

        // ======================== GOOGLE SHEETS FUNCTIONS ========================
        function initGoogleSheets() {
            if (typeof gapi === 'undefined') {
                console.warn('Google API not loaded');
                return;
            }
            gapi.load('client:auth2', () => {
                gapi.client.init({
                    apiKey: GOOGLE_SHEET_CONFIG.apiKey,
                    clientId: GOOGLE_SHEET_CONFIG.clientId,
                    discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
                    scope: "https://www.googleapis.com/auth/spreadsheets"
                }).then(loadFromGoogleSheet);
            });
        }

        function loadFromGoogleSheet() {
            // TODO: Tải dữ liệu từ Google Sheets và cập nhật vào ứng dụng
            console.log('Loading data from Google Sheets...');
        }

        function saveToGoogleSheet() {
            // TODO: Đồng bộ dữ liệu ứng dụng lên Google Sheets
            console.log('Saving data to Google Sheets...');
        }

        // Xóa tất cả dữ liệu
        function clearAllData() {
            if (!requireAdmin()) return;
            if (confirm('⚠️ Bạn có chắc chắn muốn xóa TẤT CẢ dữ liệu?\n\nHành động này không thể hoàn tác!')) {
                if (confirm('🚨 Xác nhận lần cuối: XÓA TẤT CẢ DỮ LIỆU?')) {
                    try {
                        // Xóa từ localStorage
                        localStorage.removeItem(STORAGE_KEYS.DATA);
                        localStorage.removeItem(STORAGE_KEYS.CLASS_INFO);
                        localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);

                        // Xóa từ memory
                        data = {};
                        classInfo = {};

                        // Khởi tạo lại dữ liệu mặc định
                        initDefaultClasses();
                        saveToLocalStorage();

                        // Cập nhật giao diện
                        updateStudentCounts();
                        renderClassGrid();
                        updateImportClassSelect();
                        updateSearchFilters();

                        showStorageStatus('🗑️ Đã xóa tất cả', false);
                        alert('✅ Đã xóa tất cả dữ liệu và khởi tạo lại!');
                    } catch (error) {
                        console.error('Lỗi khi xóa dữ liệu:', error);
                        showStorageStatus('❌ Lỗi xóa dữ liệu', true);
                    }
                }
            }
        }

        // Lưu tìm kiếm gần đây
        function saveRecentSearch(searchTerm) {
            if (!searchTerm.trim()) return;

            try {
                let recentSearches = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES) || '[]');
                recentSearches = recentSearches.filter(term => term !== searchTerm);
                recentSearches.unshift(searchTerm);
                recentSearches = recentSearches.slice(0, 5);

                localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(recentSearches));
            } catch (error) {
                console.error('Lỗi khi lưu tìm kiếm gần đây:', error);
            }
        }

        // ======================== INITIALIZATION FUNCTIONS ========================

        // Khởi tạo ứng dụng
        async function init() {
            loadFromLocalStorage();
            await loadFromFirebase();

            updateStudentCounts();
            renderClassGrid();
            updateImportClassSelect();
            updateSearchFilters();
            updateAdminUI();

            initGoogleSheets();
            console.log('Ứng dụng đã được khởi tạo');
        }

        // Khởi tạo các lớp mặc định
        function initDefaultClasses() {
            classInfo = {
                'PTI03': { name: 'Lập trình Python cơ bản', description: 'Khóa học Python cho người mới bắt đầu', type: 'coding', comment: '' },
                'PTI04': { name: 'Lập trình Python nâng cao', description: 'Khóa học Python nâng cao', type: 'coding', comment: '' },
                'JSB05': { name: 'JavaScript cho người mới bắt đầu', description: 'Khóa học JavaScript cơ bản', type: 'coding', comment: '' },
                'RBT01': { name: 'Robotics cơ bản', description: 'Khóa học Robotics cơ bản', type: 'robotic', comment: '' }
            };

            // Khởi tạo data cho các lớp nếu chưa có
            Object.keys(classInfo).forEach(classCode => {
                if (!data[classCode]) {
                    data[classCode] = {};
                }
            });
        }

        // Khởi tạo dữ liệu mẫu
        function initSampleData() {
            // Chỉ thêm dữ liệu mẫu nếu chưa có dữ liệu
            if (Object.keys(data).length === 0 || Object.keys(data.PTI03 || {}).length === 0) {
                data.PTI03 = data.PTI03 || {};
                data.PTI03['Nguyễn Văn A'] = {
                    email: 'nguyenvana@email.com',
                    phone: '0123456789',
                    products: [
                        {
                            session: 1,
                            name: 'Calculator App',
                            idea: 'Tạo ứng dụng máy tính đơn giản',
                            classTask: 'Học syntax Python cơ bản',
                            homework: 'Hoàn thành phép cộng, trừ',
                            progress: 75,
                            feedback: getDefaultFeedback('coding')
                        },
                        {
                            session: 2,
                            name: 'To-Do List',
                            idea: 'Ứng dụng quản lý công việc',
                            classTask: 'Học về list và loop',
                            homework: 'Thêm chức năng xóa task',
                            progress: 50,
                            feedback: getDefaultFeedback('coding')
                        }
                    ]
                };

                data.PTI04 = data.PTI04 || {};
                data.PTI04['Trần Thị B'] = {
                    email: 'tranthib@email.com',
                    phone: '0987654321',
                    products: [
                        {
                            session: 1,
                            name: 'Web Scraper',
                            idea: 'Thu thập dữ liệu từ website',
                            classTask: 'Học BeautifulSoup',
                            homework: 'Scrape một trang tin tức',
                            progress: 90,
                            feedback: getDefaultFeedback('coding')
                        }
                    ]
                };

                data.JSB05 = data.JSB05 || {};
                data.JSB05['Lê Văn C'] = {
                    email: 'levanc@email.com',
                    phone: '0369852147',
                    products: [
                        {
                            session: 1,
                            name: 'Interactive Website',
                            idea: 'Trang web tương tác với JavaScript',
                            classTask: 'Học DOM manipulation',
                            homework: 'Thêm animation',
                            progress: 60,
                            feedback: getDefaultFeedback('coding')
                        }
                    ]
                };

                // Thêm học viên không có sản phẩm
                data.PTI03['Phạm Thị D'] = {
                    email: 'phamthid@email.com',
                    phone: '0147258369',
                    products: []
                };

                data.JSB05['Hoàng Văn E'] = {
                    email: 'hoangvane@email.com',
                    phone: '0951753468',
                    products: []
                };
            }
        }

        // ======================== SEARCH FUNCTIONS ========================

        // Cập nhật bộ lọc tìm kiếm
        function updateSearchFilters() {
            const classSelect = document.getElementById('search-class-filter');
            classSelect.innerHTML = '<option value="">Tất cả lớp</option>';

            Object.keys(classInfo).forEach(classCode => {
                const option = document.createElement('option');
                option.value = classCode;
                option.textContent = `${classCode} - ${classInfo[classCode].name}`;
                classSelect.appendChild(option);
            });
        }

        // Thực hiện tìm kiếm
        function performSearch() {
            const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
            const classFilter = document.getElementById('search-class-filter').value;
            const productFilter = document.getElementById('search-product-filter').value;

            // Lưu tìm kiếm gần đây
            if (searchTerm) {
                saveRecentSearch(searchTerm);
            }

            searchResults = [];

            Object.keys(classInfo).forEach(className => {
                if (classFilter && className !== classFilter) return;

                if (data[className]) {
                    Object.keys(data[className]).forEach(studentName => {
                        const student = data[className][studentName];
                        const hasProducts = student.products && student.products.length > 0;

                        // Áp dụng bộ lọc sản phẩm
                        if (productFilter === 'with-products' && !hasProducts) return;
                        if (productFilter === 'no-products' && hasProducts) return;

                        // Tìm kiếm trong tên, email, phone và tên sản phẩm
                        const matchesName = studentName.toLowerCase().includes(searchTerm);
                        const matchesEmail = student.email && student.email.toLowerCase().includes(searchTerm);
                        const matchesPhone = student.phone && student.phone.includes(searchTerm);

                        let matchesProduct = false;
                        if (student.products) {
                            matchesProduct = student.products.some(product =>
                                product.name.toLowerCase().includes(searchTerm) ||
                                product.idea.toLowerCase().includes(searchTerm) ||
                                product.classTask.toLowerCase().includes(searchTerm) ||
                                product.homework.toLowerCase().includes(searchTerm) ||
                                feedbackToText(product, classInfo[className].type).toLowerCase().includes(searchTerm)
                            );
                        }

                        if (!searchTerm || matchesName || matchesEmail || matchesPhone || matchesProduct) {
                            searchResults.push({
                                name: studentName,
                                class: className,
                                student: student,
                                matchType: getMatchType(searchTerm, studentName, student, className)
                            });
                        }
                    });
                }
            });

            displaySearchResults();
            updateSearchStats();
        }

        // Xác định loại match để highlight
        function getMatchType(searchTerm, studentName, student, className) {
            if (!searchTerm) return 'all';

            if (studentName.toLowerCase().includes(searchTerm)) return 'name';
            if (student.email && student.email.toLowerCase().includes(searchTerm)) return 'email';
            if (student.phone && student.phone.includes(searchTerm)) return 'phone';

            if (student.products && student.products.some(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.idea.toLowerCase().includes(searchTerm) ||
                p.classTask.toLowerCase().includes(searchTerm) ||
                p.homework.toLowerCase().includes(searchTerm) ||
                feedbackToText(p, classInfo[className].type).toLowerCase().includes(searchTerm)
            )) {
                return 'product';
            }

            return 'none';
        }

        // Highlight text
        function highlightText(text, searchTerm) {
            if (!searchTerm || !text) return text;

            // escape các ký tự đặc biệt trong regex
            const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            const regex = new RegExp(`(${escaped})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        }


        // Hiển thị kết quả tìm kiếm
        function displaySearchResults() {
            const container = document.getElementById('search-results');
            const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();

            if (searchResults.length === 0) {
                container.innerHTML = `
                    <div class="no-results">
                        <i>😔</i>
                        <p>Không tìm thấy học viên nào phù hợp với từ khóa tìm kiếm</p>
                        <small>Hãy thử với từ khóa khác hoặc xóa bộ lọc</small>
                    </div>
                `;
                return;
            }

            container.innerHTML = '';

            searchResults.forEach(result => {
                const div = document.createElement('div');
                div.className = 'student-card';
                div.onclick = () => {
                    currentClass = result.class;
                    showStudent(result.name);
                };

                const studentName = highlightText(result.name, searchTerm);
                const studentEmail = highlightText(result.student.email || 'Chưa có email', searchTerm);
                const studentPhone = highlightText(result.student.phone || 'Chưa có SĐT', searchTerm);

                let productInfo = '';
                if (result.matchType === 'product' && searchTerm) {
                    const matchingProducts = result.student.products.filter(p =>
                        p.name.toLowerCase().includes(searchTerm) ||
                        p.idea.toLowerCase().includes(searchTerm) ||
                        p.classTask.toLowerCase().includes(searchTerm) ||
                        p.homework.toLowerCase().includes(searchTerm) ||
                        feedbackToText(p, classInfo[result.class].type).toLowerCase().includes(searchTerm)
                    );

                    if (matchingProducts.length > 0) {
                        const productNames = matchingProducts.map(p => highlightText(p.name, searchTerm)).join(', ');
                        productInfo = `<p style="font-size: 0.9em; color: #666; margin-top: 5px;">📋 Sản phẩm: ${productNames}</p>`;
                    }
                }

                div.innerHTML = `
                    <div class="student-class-badge">${result.class}</div>
                    <h4>${studentName}</h4>
                    <p>${studentEmail}</p>
                    <p>${studentPhone}</p>
                    ${productInfo}
                    <div class="product-count">${result.student.products.length} sản phẩm</div>
                    <button class="btn btn-danger" style="margin-top: 10px; font-size: 12px; padding: 5px 10px;" onclick="event.stopPropagation(); deleteStudentFromSearch('${result.class}', '${result.name}')">Xóa</button>
                `;

                container.appendChild(div);
            });
        }

        // Cập nhật thống kê tìm kiếm
        function updateSearchStats() {
            const stats = document.getElementById('search-stats');
            const searchTerm = document.getElementById('search-input').value.trim();
            const classFilter = document.getElementById('search-class-filter').value;
            const productFilter = document.getElementById('search-product-filter').value;

            let statsText = `Tìm thấy ${searchResults.length} học viên`;

            if (searchTerm) {
                statsText += ` với từ khóa "${searchTerm}"`;
            }

            if (classFilter) {
                statsText += ` trong lớp ${classFilter}`;
            }

            if (productFilter === 'with-products') {
                statsText += ` có sản phẩm`;
            } else if (productFilter === 'no-products') {
                statsText += ` chưa có sản phẩm`;
            }

            stats.textContent = statsText;
        }

        // Xóa bộ lọc tìm kiếm
        function clearSearchFilters() {
            document.getElementById('search-input').value = '';
            document.getElementById('search-class-filter').value = '';
            document.getElementById('search-product-filter').value = '';
            performSearch();
        }

        // Xóa học viên từ trang tìm kiếm
        function deleteStudentFromSearch(className, studentName) {
            if (!requireAdmin()) return;
            if (confirm(`Bạn có chắc muốn xóa học viên ${studentName} khỏi lớp ${className}?`)) {
                delete data[className][studentName];
                saveToLocalStorage(); // Lưu vào localStorage
                updateStudentCounts();
                performSearch(); // Cập nhật lại kết quả tìm kiếm
            }
        }

        // Hiển thị trang tìm kiếm
        function showSearchPage() {
            hideAllPages();
            document.getElementById('search-page').classList.remove('hidden');
            setActiveNav(2);
            updateSearchFilters();
            performSearch(); // Hiển thị tất cả học viên ban đầu
        }

        // ======================== NAVIGATION FUNCTIONS ========================

        // Render lại grid các lớp học
        function renderClassGrid() {
            const grid = document.getElementById('class-grid');
            grid.innerHTML = '';

            const sections = {
                robotic: { title: 'Robotic', element: null },
                coding: { title: 'Coding', element: null }
            };

            Object.keys(sections).forEach(key => {
                const title = document.createElement('h3');
                title.textContent = sections[key].title;
                title.className = 'class-section-title';
                grid.appendChild(title);

                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'class-grid-section';
                sectionDiv.id = `${key}-section`;
                grid.appendChild(sectionDiv);
                sections[key].element = sectionDiv;
            });

            Object.keys(classInfo).forEach(classCode => {
                const classData = classInfo[classCode];
                const type = classData.type || 'coding';
                const section = sections[type].element;
                const div = document.createElement('div');
                div.className = 'class-card';
                div.onclick = () => showClass(classCode);

                div.innerHTML = `
                    <h3>${classCode}</h3>
                    <p>${classData.name}</p>
                    <small style="color: #666;">${classData.description || ''}</small>
                    <button class="btn btn-danger" style="margin-top: 10px; font-size: 12px; padding: 5px 10px;" onclick="event.stopPropagation(); deleteClass('${classCode}')">Xóa lớp</button>
                `;

                section.appendChild(div);
            });
        }

        // Hiển thị trang chủ
        function showHome() {
            hideAllPages();
            document.getElementById('home-page').classList.remove('hidden');
            setActiveNav(0);
            updateStudentCounts();
            renderClassGrid();
        }

        // Hiển thị trang lớp học
        function showClass(className) {
            currentClass = className;
            hideAllPages();
            document.getElementById('class-page').classList.remove('hidden');
            document.getElementById('class-title').textContent = `Lớp ${className} - ${classInfo[className].name}`;
            document.getElementById('class-comment').value = classInfo[className].comment || '';
            displayStudents();
        }

        // Hiển thị trang học viên
        function showStudent(studentName) {
            currentStudent = studentName;
            hideAllPages();
            document.getElementById('student-page').classList.remove('hidden');
            document.getElementById('student-title').textContent = `Sản phẩm của ${studentName} - Lớp ${currentClass}`;
            displayProducts();
        }

        // Hiển thị tất cả học viên
        function showAllStudents() {
            hideAllPages();
            document.getElementById('all-students-page').classList.remove('hidden');
            setActiveNav(1);
            displayAllStudents();
        }

        // Ẩn tất cả trang
        function hideAllPages() {
            const pages = ['home-page', 'class-page', 'student-page', 'all-students-page', 'search-page'];
            pages.forEach(page => {
                document.getElementById(page).classList.add('hidden');
            });
        }

        // Set active navigation
        function setActiveNav(index) {
            const navBtns = document.querySelectorAll('.nav-btn');
            navBtns.forEach((btn, i) => {
                if (i === index) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        // ======================== CLASS MANAGEMENT ========================

        // Thêm lớp học mới
        function showAddClassModal() {
            document.getElementById('add-class-modal').style.display = 'block';
            clearClassForm();
        }

        function clearClassForm() {
            document.getElementById('class-code').value = '';
            document.getElementById('class-name').value = '';
            document.getElementById('class-type').value = 'coding';
            document.getElementById('class-description').value = '';
        }

        function addClass() {
            if (!requireAdmin()) return;
            const code = document.getElementById('class-code').value.trim().toUpperCase();
            const name = document.getElementById('class-name').value.trim();
            const description = document.getElementById('class-description').value.trim();
            const type = document.getElementById('class-type').value;

            if (!code || !name) {
                alert('Vui lòng nhập mã lớp và tên lớp!');
                return;
            }

            if (classInfo[code]) {
                alert('Mã lớp đã tồn tại!');
                return;
            }

            classInfo[code] = {
                name: name,
                description: description,
                type: type,
                comment: ''
            };

            data[code] = {};

            saveToLocalStorage(); // Lưu vào localStorage

            closeModal('add-class-modal');
            renderClassGrid();
            updateStudentCounts();
            updateImportClassSelect();
            updateSearchFilters();
        }

        // Xóa lớp học
        function deleteClass(classCode) {
            if (!requireAdmin()) return;
            if (confirm(`Bạn có chắc muốn xóa lớp ${classCode}? Tất cả dữ liệu học viên sẽ bị mất!`)) {
                delete classInfo[classCode];
                delete data[classCode];

                saveToLocalStorage(); // Lưu vào localStorage

                renderClassGrid();
                updateStudentCounts();
                updateImportClassSelect();
                updateSearchFilters();
            }
        }

        function saveClassComment() {
            if (!requireAdmin()) return;
            if (!classInfo[currentClass]) return;
            classInfo[currentClass].comment = document.getElementById('class-comment').value.trim();
            saveToLocalStorage();
        }

        // ======================== STUDENT MANAGEMENT ========================

        // Cập nhật danh sách lớp trong select import
        function updateImportClassSelect() {
            const select = document.getElementById('import-class');
            select.innerHTML = '';

            Object.keys(classInfo).forEach(classCode => {
                const option = document.createElement('option');
                option.value = classCode;
                option.textContent = `${classCode} - ${classInfo[classCode].name}`;
                select.appendChild(option);
            });
        }

        // Quay lại trang lớp
        function goBackToClass() {
            showClass(currentClass);
        }

        // Cập nhật số lượng học viên
        function updateStudentCounts() {
            Object.keys(classInfo).forEach(className => {
                const count = data[className] ? Object.keys(data[className]).length : 0;
                const countElement = document.getElementById(`count-${className}`);
                if (countElement) {
                    countElement.textContent = `${count} học viên`;
                }
            });
        }

        // Hiển thị form thêm học viên
        function showAddStudentForm() {
            document.getElementById('add-student-modal').style.display = 'block';
            clearStudentForm();
        }

        // Xóa form học viên
        function clearStudentForm() {
            document.getElementById('student-name').value = '';
            document.getElementById('student-email').value = '';
            document.getElementById('student-phone').value = '';
        }

        // Thêm học viên
        function addStudent() {
            if (!requireAdmin()) return;
            const name = document.getElementById('student-name').value.trim();
            const email = document.getElementById('student-email').value.trim();
            const phone = document.getElementById('student-phone').value.trim();

            if (!name) {
                alert('Vui lòng nhập tên học viên!');
                return;
            }

            if (data[currentClass][name]) {
                alert('Học viên đã tồn tại!');
                return;
            }

            data[currentClass][name] = {
                email: email,
                phone: phone,
                products: []
            };

            saveToLocalStorage(); // Lưu vào localStorage

            closeModal('add-student-modal');
            displayStudents();
            updateStudentCounts();
        }

        // Hiển thị danh sách học viên
        function displayStudents() {
            const container = document.getElementById('students-list');
            container.innerHTML = '';

            Object.keys(data[currentClass]).forEach(studentName => {
                const student = data[currentClass][studentName];
                const div = document.createElement('div');
                div.className = 'student-card';
                div.onclick = () => showStudent(studentName);

                div.innerHTML = `
                    <h4>${studentName}</h4>
                    <p>${student.email || 'Chưa có email'}</p>
                    <p>${student.phone || 'Chưa có SĐT'}</p>
                    <div class="product-count">${student.products.length} sản phẩm</div>
                    <button class="btn" style="margin-top: 10px; font-size: 12px; padding: 5px 10px;" onclick="event.stopPropagation(); showFeedbackHistoryFromClass('${studentName}')">📋 Nhận xét</button>
                    <button class="btn btn-danger admin-only" style="margin-top: 10px; font-size: 12px; padding: 5px 10px;" onclick="event.stopPropagation(); deleteStudent('${studentName}')">Xóa</button>
                `;

                container.appendChild(div);
            });
            updateAdminUI();
        }
        function showFeedbackHistoryFromClass(studentName) {
            currentStudent = studentName;
            showFeedbackHistory();
        }


        // Hiển thị tất cả học viên
        function displayAllStudents() {
            const container = document.getElementById('all-students-list');
            container.innerHTML = '';

            Object.keys(classInfo).forEach(className => {
                if (data[className]) {
                    Object.keys(data[className]).forEach(studentName => {
                        const student = data[className][studentName];
                        const div = document.createElement('div');
                        div.className = 'student-card';
                        div.onclick = () => {
                            currentClass = className;
                            showStudent(studentName);
                        };

                        div.innerHTML = `
                            <div class="student-class-badge">${className}</div>
                            <h4>${studentName}</h4>
                            <p>${student.email || 'Chưa có email'}</p>
                            <div class="product-count">${student.products.length} sản phẩm</div>
                        `;

                        container.appendChild(div);
                    });
                }
            });
            updateAdminUI();
        }

        // Xóa học viên
        function deleteStudent(studentName) {
            if (!requireAdmin()) return;
            if (confirm(`Bạn có chắc muốn xóa học viên ${studentName}?`)) {
                delete data[currentClass][studentName];
                saveToLocalStorage(); // Lưu vào localStorage
                displayStudents();
                updateStudentCounts();
            }
        }

        // ======================== PRODUCT MANAGEMENT ========================

        function getDefaultFeedback(type) {
            const result = {};
            const criteria = FEEDBACK_CRITERIA[type] || {};
            Object.keys(criteria).forEach(key => {
                result[key] = criteria[key].samples[0] || '';
            });
            return result;
        }

        function renderFeedbackFields(type, existing = {}) {
            const container = document.getElementById('feedback-fields');
            container.innerHTML = '';
            const criteria = FEEDBACK_CRITERIA[type] || {};
            Object.keys(criteria).forEach(key => {
                const cfg = criteria[key];
                const selectId = `sample-${key}`;
                const textareaId = `feedback-${key}`;
                const options = cfg.samples.map(s => {
                    const short = s.length > 60 ? s.substring(0, 60) + '...' : s;
                    return `<option value="${escapeHtml(s)}">${escapeHtml(short)}</option>`;
                }).join('');
                const div = document.createElement('div');
                div.className = 'form-group';
                div.innerHTML = `
                    <label>${cfg.label}:</label>
                    <select id="${selectId}" onchange="document.getElementById('${textareaId}').value=this.value">${options}</select>
                    <textarea id="${textareaId}">${existing[key] || cfg.samples[0] || ''}</textarea>
                `;
                container.appendChild(div);
            });
        }

        function collectFeedback(type) {
            const criteria = FEEDBACK_CRITERIA[type] || {};
            const result = {};
            Object.keys(criteria).forEach(key => {
                result[key] = document.getElementById(`feedback-${key}`).value.trim();
            });
            return result;
        }

        // Hiển thị form thêm sản phẩm
        function showAddProductForm() {
            editingProductIndex = -1;
            document.getElementById('product-modal-title').textContent = 'Thêm sản phẩm mới';
            document.getElementById('save-product-btn').textContent = 'Thêm sản phẩm';
            clearProductForm();
            document.getElementById('add-product-modal').style.display = 'block';
        }

        // Hiển thị form sửa sản phẩm
        function showEditProductForm(index) {
            editingProductIndex = index;
            const product = data[currentClass][currentStudent].products[index];

            document.getElementById('product-modal-title').textContent = 'Sửa sản phẩm';
            document.getElementById('save-product-btn').textContent = 'Cập nhật sản phẩm';

            document.getElementById('product-session').value = product.session;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-idea').value = product.idea;
            document.getElementById('product-class-task').value = product.classTask;
            document.getElementById('product-homework').value = product.homework;
            document.getElementById('product-progress').value = product.progress;
            renderFeedbackFields(classInfo[currentClass]?.type, product.feedback);

            document.getElementById('add-product-modal').style.display = 'block';
        }

        // Xóa form sản phẩm
        function clearProductForm() {
            document.getElementById('product-session').value = '';
            document.getElementById('product-name').value = '';
            document.getElementById('product-idea').value = '';
            document.getElementById('product-class-task').value = '';
            document.getElementById('product-homework').value = '';
            document.getElementById('product-progress').value = '0';
            renderFeedbackFields(classInfo[currentClass]?.type, getDefaultFeedback(classInfo[currentClass]?.type));
        }

        // Lưu sản phẩm
        function saveProduct() {
            if (!requireAdmin()) return;
            const type = classInfo[currentClass]?.type;
            const product = {
                session: parseInt(document.getElementById('product-session').value),
                name: document.getElementById('product-name').value.trim(),
                idea: document.getElementById('product-idea').value.trim(),
                classTask: document.getElementById('product-class-task').value.trim(),
                homework: document.getElementById('product-homework').value.trim(),
                progress: parseInt(document.getElementById('product-progress').value),
                feedback: collectFeedback(type)
            };

            if (!product.name || !product.session) {
                alert('Vui lòng nhập tên sản phẩm và buổi học!');
                return;
            }

            if (editingProductIndex === -1) {
                const exists = data[currentClass][currentStudent].products.find(p => p.session === product.session);
                if (exists) {
                    alert('Buổi học này đã có nhận xét. Vui lòng chỉnh sửa nhận xét cũ hoặc chọn buổi khác.');
                    return;
                }
                data[currentClass][currentStudent].products.push(product);
            } else {
                data[currentClass][currentStudent].products[editingProductIndex] = product;
            }

            saveToLocalStorage(); // Lưu vào localStorage

            closeModal('add-product-modal');
            displayProducts();
        }

        function feedbackToText(product, typeOverride) {
            if (!product || !product.feedback) return '';
            if (typeof product.feedback === 'string') return product.feedback;
            if (product.feedback.general) return product.feedback.general;
            const type = typeOverride || classInfo[currentClass]?.type;
            const criteria = FEEDBACK_CRITERIA[type] || {};
            return Object.keys(criteria)
                .map(key => `${criteria[key].label}: ${product.feedback[key] || ''}`)
                .join('\n');
        }

        // Rút gọn nội dung dài và tạo liên kết xem thêm
        function renderTruncated(text) {
            if (!text) return '';
            const limit = 50;
            const normalized = text.replace(/\n/g, ' ');
            let short = normalized;
            let link = '';
            if (normalized.length > limit) {
                short = normalized.substring(0, limit) + '...';
                link = ` <a href="#" onclick="showDetail('${encodeURIComponent(text)}');return false;">Xem thêm</a>`;
            }
            return escapeHtml(short) + link;
        }

        // Hiển thị nội dung chi tiết trong modal
        function showDetail(encoded) {
            const content = decodeURIComponent(encoded);
            document.getElementById('detail-content').innerHTML = escapeHtml(content).replace(/\n/g, '<br>');
            document.getElementById('detail-modal').style.display = 'block';
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Hiển thị danh sách sản phẩm
        function displayProducts() {
            const tbody = document.getElementById('products-tbody');
            tbody.innerHTML = '';

            const products = data[currentClass][currentStudent].products;
            products.sort((a, b) => a.session - b.session); // Sắp xếp theo buổi học

            products.forEach((product, index) => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>Buổi ${product.session}</td>
                    <td>${product.name}</td>
                    <td>${renderTruncated(product.idea)}</td>
                    <td>${renderTruncated(product.classTask)}</td>
                    <td>${renderTruncated(product.homework)}</td>
                    <td>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${product.progress}%">
                                ${product.progress}%
                            </div>
                        </div>
                    </td>
                    <td>${renderTruncated(feedbackToText(product))}</td>
                    <td>
                        <button class="btn admin-only" style="font-size: 12px; padding: 5px 10px;" onclick="showEditProductForm(${index})">Sửa</button>
                        <button class="btn btn-danger admin-only" style="font-size: 12px; padding: 5px 10px;" onclick="deleteProduct(${index})">Xóa</button>
                    </td>
                `;
            });
            updateAdminUI();
        }

        // Hiển thị lịch sử nhận xét của học viên
        function showFeedbackHistory() {
            const student = data[currentClass][currentStudent];
            const container = document.getElementById('feedback-history');
            container.innerHTML = '';

            if (!student || student.products.length === 0) {
                container.innerHTML = '<p>Chưa có nhận xét nào.</p>';
            } else {
                const sorted = [...student.products].sort((a, b) => a.session - b.session);
                sorted.forEach(p => {
                    const div = document.createElement('div');
                    div.className = 'feedback-item';
                    const text = feedbackToText(p);
                    div.innerHTML = `<h4>Buổi ${p.session} - ${escapeHtml(p.name)}</h4><p>${escapeHtml(text).replace(/\n/g,'<br>')}</p>`;
                    container.appendChild(div);
                });
            }

            document.getElementById('feedback-modal').style.display = 'block';
        }

        // Xóa sản phẩm
        function deleteProduct(index) {
            if (!requireAdmin()) return;
            if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
                data[currentClass][currentStudent].products.splice(index, 1);
                saveToLocalStorage(); // Lưu vào localStorage
                displayProducts();
            }
        }

        // ======================== MODAL FUNCTIONS ========================

        // Đóng modal
        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        // Hiển thị modal import
        function showImportModal() {
            document.getElementById('import-modal').style.display = 'block';
            updateImportClassSelect();
            document.getElementById('excel-file').value = '';
            document.getElementById('preview-container').innerHTML = '';
            document.getElementById('import-btn').disabled = true;
            pendingImportData = null;
        }

        // Hiển thị hướng dẫn format Excel
        function showFormatGuide() {
            document.getElementById('format-guide-modal').style.display = 'block';
        }

        // ======================== EXCEL FUNCTIONS ========================

        // Tải file mẫu Excel
        function downloadTemplate() {
            const templateData = [
                ['Tên học viên', 'Email', 'Số điện thoại', 'Buổi học', 'Tên sản phẩm', 'Ý tưởng', 'Nhiệm vụ buổi học', 'Nhiệm vụ về nhà', 'Tiến độ (%)', 'Góp ý'],
                ['Nguyễn Văn A', 'nguyenvana@email.com', '0123456789', '1', 'Calculator App', 'Ứng dụng máy tính đơn giản', 'Học syntax Python cơ bản', 'Hoàn thành phép cộng, trừ', '75', 'Làm tốt, cần cải thiện giao diện'],
                ['Nguyễn Văn A', 'nguyenvana@email.com', '0123456789', '2', 'To-Do List', 'Ứng dụng quản lý công việc', 'Học về list và loop', 'Thêm chức năng xóa task', '50', 'Cần thêm validation'],
                ['Trần Thị B', 'tranthib@email.com', '0987654321', '', '', '', '', '', '', ''],
                ['Lê Văn C', 'levanc@email.com', '0369852147', '1', 'Interactive Website', 'Trang web tương tác với JavaScript', 'Học DOM manipulation', 'Thêm animation', '60', 'Tốt, cần chú ý responsive design']
            ];

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(templateData);
            XLSX.utils.book_append_sheet(wb, ws, 'Template');
            XLSX.writeFile(wb, 'Template_Import_Students.xlsx');
        }

        // Xử lý upload file Excel
        function handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    if (jsonData.length < 2) {
                        alert('File Excel phải có ít nhất 2 dòng (header và dữ liệu)');
                        return;
                    }

                    // Parse dữ liệu
                    const parsedData = parseExcelData(jsonData);
                    if (parsedData && parsedData.length > 0) {
                        pendingImportData = parsedData;
                        showPreview(parsedData);
                        document.getElementById('import-btn').disabled = false;
                    } else {
                        alert('Không thể đọc dữ liệu từ file Excel');
                    }

                } catch (error) {
                    alert('Lỗi khi đọc file Excel: ' + error.message);
                }
            };
            reader.readAsArrayBuffer(file);
        }

        // Parse dữ liệu Excel
        function parseExcelData(jsonData) {
            const students = {};

            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i];

                // Bỏ qua dòng trống
                if (!row[0] || row[0].toString().trim() === '') continue;

                const studentName = row[0].toString().trim();
                const email = row[1] ? row[1].toString().trim() : '';
                const phone = row[2] ? row[2].toString().trim() : '';

                // Khởi tạo học viên nếu chưa có
                if (!students[studentName]) {
                    students[studentName] = {
                        email: email,
                        phone: phone,
                        products: []
                    };
                }

                // Thêm sản phẩm nếu có dữ liệu
                if (row[3] && row[4]) { // Có buổi học và tên sản phẩm
                    const session = parseInt(row[3]);
                    if (isNaN(session) || session < 1) {
                        console.warn(`Buổi học không hợp lệ cho ${studentName}: ${row[3]}`);
                        continue;
                    }

                    let progress = 0;
                    if (row[8]) {
                        progress = parseInt(row[8]);
                        if (isNaN(progress) || progress < 0 || progress > 100) {
                            progress = 0;
                        }
                    }

                    const product = {
                        session: session,
                        name: row[4] ? row[4].toString().trim() : '',
                        idea: row[5] ? row[5].toString().trim() : '',
                        classTask: row[6] ? row[6].toString().trim() : '',
                        homework: row[7] ? row[7].toString().trim() : '',
                        progress: progress,
                        feedback: row[9] ? row[9].toString().trim() : ''
                    };

                    students[studentName].products.push(product);
                }
            }

            return Object.keys(students).map(name => ({
                name: name,
                ...students[name]
            }));
        }

        // Hiển thị preview dữ liệu
        function showPreview(studentsData) {
            const container = document.getElementById('preview-container');

            let html = `
                <h4>Preview dữ liệu (${studentsData.length} học viên):</h4>
                <div style="max-height: 250px; overflow-y: auto; border: 1px solid #ddd; border-radius: 5px;">
                    <table class="product-table" style="margin: 0;">
                        <thead>
                            <tr>
                                <th>Tên học viên</th>
                                <th>Email</th>
                                <th>SĐT</th>
                                <th>Số sản phẩm</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            studentsData.forEach(student => {
                html += `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${student.phone}</td>
                        <td>${student.products.length}</td>
                    </tr>
                `;
            });

            html += '</tbody></table></div>';
            container.innerHTML = html;
        }

        // Import dữ liệu vào hệ thống
        function importData() {
            if (!pendingImportData) {
                alert('Không có dữ liệu để import');
                return;
            }

            const selectedClass = document.getElementById('import-class').value;
            const overwrite = document.getElementById('overwrite-data').checked;

            if (!selectedClass) {
                alert('Vui lòng chọn lớp để import');
                return;
            }

            // Xóa dữ liệu cũ nếu chọn ghi đè
            if (overwrite) {
                data[selectedClass] = {};
            }

            let importedCount = 0;
            let updatedCount = 0;

            pendingImportData.forEach(studentData => {
                if (data[selectedClass][studentData.name]) {
                    // Học viên đã tồn tại
                    if (overwrite) {
                        data[selectedClass][studentData.name] = {
                            email: studentData.email,
                            phone: studentData.phone,
                            products: studentData.products
                        };
                        updatedCount++;
                    } else {
                        // Merge sản phẩm mới
                        const existingProducts = data[selectedClass][studentData.name].products;
                        studentData.products.forEach(newProduct => {
                            // Kiểm tra xem sản phẩm đã tồn tại chưa (cùng session và tên)
                            const existingProduct = existingProducts.find(p =>
                                p.session === newProduct.session && p.name === newProduct.name
                            );

                            if (!existingProduct) {
                                existingProducts.push(newProduct);
                            }
                        });
                        updatedCount++;
                    }
                } else {
                    // Học viên mới
                    data[selectedClass][studentData.name] = {
                        email: studentData.email,
                        phone: studentData.phone,
                        products: studentData.products
                    };
                    importedCount++;
                }
            });

            saveToLocalStorage(); // Lưu vào localStorage

            closeModal('import-modal');
            updateStudentCounts();
            renderClassGrid();

            alert(`Import thành công!\n- ${importedCount} học viên mới\n- ${updatedCount} học viên được cập nhật`);
        }

        // Xuất dữ liệu Excel - Tất cả
        function exportData() {
            const wb = XLSX.utils.book_new();

            Object.keys(classInfo).forEach(className => {
                if (data[className]) {
                    const worksheetData = [];
                    worksheetData.push(['Tên học viên', 'Email', 'Số điện thoại', 'Buổi học', 'Tên sản phẩm', 'Ý tưởng', 'Nhiệm vụ buổi học', 'Nhiệm vụ về nhà', 'Tiến độ (%)', 'Góp ý']);

                    Object.keys(data[className]).forEach(studentName => {
                        const student = data[className][studentName];
                        if (student.products.length === 0) {
                            worksheetData.push([studentName, student.email, student.phone, '', '', '', '', '', '', '']);
                        } else {
                            student.products.forEach(product => {
                                worksheetData.push([
                                    studentName,
                                    student.email,
                                    student.phone,
                                    product.session,
                                    product.name,
                                    product.idea,
                                    product.classTask,
                                    product.homework,
                                    product.progress,
                                    feedbackToText(product, classInfo[className].type)
                                ]);
                            });
                        }
                    });

                    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
                    XLSX.utils.book_append_sheet(wb, ws, className);
                }
            });

            XLSX.writeFile(wb, `Danh_sach_hoc_vien_${new Date().toISOString().split('T')[0]}.xlsx`);
        }

        // Xuất dữ liệu lớp
        function exportClassData() {
            const worksheetData = [];
            worksheetData.push(['Tên học viên', 'Email', 'Số điện thoại', 'Buổi học', 'Tên sản phẩm', 'Ý tưởng', 'Nhiệm vụ buổi học', 'Nhiệm vụ về nhà', 'Tiến độ (%)', 'Góp ý']);

            Object.keys(data[currentClass]).forEach(studentName => {
                const student = data[currentClass][studentName];
                if (student.products.length === 0) {
                    worksheetData.push([studentName, student.email, student.phone, '', '', '', '', '', '', '']);
                } else {
                    student.products.forEach(product => {
                        worksheetData.push([
                            studentName,
                            student.email,
                            student.phone,
                            product.session,
                            product.name,
                            product.idea,
                            product.classTask,
                            product.homework,
                            product.progress,
                            feedbackToText(product, classInfo[currentClass].type)
                        ]);
                    });
                }
            });

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(worksheetData);
            XLSX.utils.book_append_sheet(wb, ws, currentClass);

            XLSX.writeFile(wb, `Lop_${currentClass}_${new Date().toISOString().split('T')[0]}.xlsx`);
        }

        // Xuất dữ liệu học viên
        function exportStudentData() {
            const worksheetData = [];
            worksheetData.push(['Buổi học', 'Tên sản phẩm', 'Ý tưởng', 'Nhiệm vụ buổi học', 'Nhiệm vụ về nhà', 'Tiến độ (%)', 'Góp ý']);

            const student = data[currentClass][currentStudent];
            student.products.forEach(product => {
                worksheetData.push([
                    product.session,
                    product.name,
                    product.idea,
                    product.classTask,
                    product.homework,
                    product.progress,
                    feedbackToText(product, classInfo[currentClass].type)
                ]);
            });

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(worksheetData);
            XLSX.utils.book_append_sheet(wb, ws, 'San_pham');

            XLSX.writeFile(wb, `${currentStudent}_${currentClass}_${new Date().toISOString().split('T')[0]}.xlsx`);
        }

        // ======================== EVENT LISTENERS ========================

        // Event listeners
        document.addEventListener('DOMContentLoaded', function () {
            // Đóng modal khi click outside
            window.onclick = function (event) {
                const modals = document.getElementsByClassName('modal');
                Array.from(modals).forEach(modal => {
                    if (event.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            };

            // Khởi tạo ứng dụng
            init();
        });

        // Thêm các phím tắt
        document.addEventListener('keydown', function (e) {
            // ESC để đóng modal
            if (e.key === 'Escape') {
                const modals = document.getElementsByClassName('modal');
                Array.from(modals).forEach(modal => {
                    if (modal.style.display === 'block') {
                        modal.style.display = 'none';
                    }
                });
            }

            // Ctrl + F để focus vào ô tìm kiếm
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                const searchInput = document.getElementById('search-input');
                if (!document.getElementById('search-page').classList.contains('hidden')) {
                    searchInput.focus();
                } else {
                    showSearchPage();
                    setTimeout(() => searchInput.focus(), 100);
                }
            }

            // Ctrl + S để lưu khi đang trong form
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                const productModal = document.getElementById('add-product-modal');
                const studentModal = document.getElementById('add-student-modal');
                const classModal = document.getElementById('add-class-modal');

                if (productModal.style.display === 'block') {
                    saveProduct();
                } else if (studentModal.style.display === 'block') {
                    addStudent();
                } else if (classModal.style.display === 'block') {
                    addClass();
                }
            }
        });
const exposed = {
    clearAllData,
    showHome,
    showAllStudents,
    showSearchPage,
    showAddClassModal,
    exportData,
    showImportModal,
    showLoginModal,
    logout,
    showFormatGuide,
    clearSearchFilters,
    showAddStudentForm,
    exportClassData,
    saveClassComment,
    goBackToClass,
    showAddProductForm,
    showFeedbackHistory,
    exportStudentData,
    addClass,
    addStudent,
    saveProduct,
    importData,
    downloadTemplate,
    loginAdmin,
    deleteStudent,
    deleteStudentFromSearch,
    deleteProduct,
    deleteClass,
    showStudent,
    showFeedbackHistoryFromClass,
    showEditProductForm,
    closeModal,
    showDetail
};
Object.assign(window, exposed);
