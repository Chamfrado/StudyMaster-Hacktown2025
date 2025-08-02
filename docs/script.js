// Configuração da API - substitua pela URL real após deploy
const API_BASE_URL = 'https://your-api-gateway-url.execute-api.region.amazonaws.com/prod';

class StudyMaster {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.difficultyFilter = document.getElementById('difficultyFilter');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.clearFilters = document.getElementById('clearFilters');
        this.createRoadmapBtn = document.getElementById('createRoadmapBtn');
        this.results = document.getElementById('results');
        this.loading = document.getElementById('loading');
        this.noResults = document.getElementById('noResults');
        this.modal = document.getElementById('roadmapModal');
        this.roadmapDetails = document.getElementById('roadmapDetails');
        this.createModal = document.getElementById('createModal');
        this.createForm = document.getElementById('createRoadmapForm');
        
        // Sistema de usuários
        this.loginModal = document.getElementById('loginModal');
        this.registerModal = document.getElementById('registerModal');
        this.myRoadmapsModal = document.getElementById('myRoadmapsModal');
        this.favoritesModal = document.getElementById('favoritesModal');
        this.completedModal = document.getElementById('completedModal');
        this.loginSection = document.getElementById('loginSection');
        this.userSection = document.getElementById('userSection');
        this.welcomeUser = document.getElementById('welcomeUser');
        this.userDropdown = document.getElementById('userDropdown');
        
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        this.users = JSON.parse(localStorage.getItem('users') || '[]');
        this.userRoadmaps = JSON.parse(localStorage.getItem('userRoadmaps') || '[]');
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.completed = JSON.parse(localStorage.getItem('completed') || '[]');
        
        this.initializeDefaultUser();
        this.initEventListeners();
        this.updateUserInterface();
        this.loadInitialRoadmaps();
        
        // Container de notificações
        this.notificationContainer = document.getElementById('notificationContainer');
    }

    initializeDefaultUser() {
        if (this.users.length === 0) {
            this.users.push({
                id: '1',
                username: 'user',
                password: 'user',
                name: 'Usuário Padrão'
            });
            localStorage.setItem('users', JSON.stringify(this.users));
        }
    }

    initEventListeners() {
        // Busca e filtros
        this.searchBtn.addEventListener('click', () => this.search());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.search();
        });
        this.difficultyFilter.addEventListener('change', () => this.search());
        this.categoryFilter.addEventListener('change', () => this.search());
        this.clearFilters.addEventListener('click', () => this.clearAllFilters());
        this.createRoadmapBtn.addEventListener('click', () => this.openCreateModal());
        
        // Sistema de usuários
        document.getElementById('loginBtn').addEventListener('click', () => this.openLoginModal());
        document.getElementById('registerBtn').addEventListener('click', () => this.openRegisterModal());
        document.getElementById('userMenuBtn').addEventListener('click', () => this.toggleUserDropdown());
        document.getElementById('myRoadmapsBtn').addEventListener('click', () => this.openMyRoadmaps());
        document.getElementById('favoritesBtn').addEventListener('click', () => this.openFavorites());
        document.getElementById('completedBtn').addEventListener('click', () => this.openCompleted());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        
        // Formulários
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        
        // Modais
        this.setupModalEvents();
        
        // Criar roadmap
        document.getElementById('addStepBtn').addEventListener('click', () => this.addStep());
        document.getElementById('cancelCreate').addEventListener('click', () => this.createModal.classList.add('hidden'));
        this.createForm.addEventListener('submit', (e) => this.handleCreateSubmit(e));
    }

    setupModalEvents() {
        const modals = [
            { modal: this.modal, close: '.close' },
            { modal: this.createModal, close: '.close-create' },
            { modal: this.loginModal, close: '.close-login' },
            { modal: this.registerModal, close: '.close-register' },
            { modal: this.myRoadmapsModal, close: '.close-manage' },
            { modal: this.favoritesModal, close: '.close-favorites' },
            { modal: this.completedModal, close: '.close-completed' }
        ];

        modals.forEach(({ modal, close }) => {
            document.querySelector(close).addEventListener('click', () => {
                modal.classList.add('hidden');
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });

        document.getElementById('cancelLogin').addEventListener('click', () => this.loginModal.classList.add('hidden'));
        document.getElementById('cancelRegister').addEventListener('click', () => this.registerModal.classList.add('hidden'));
    }

    updateUserInterface() {
        if (this.currentUser) {
            this.loginSection.classList.add('hidden');
            this.userSection.classList.remove('hidden');
            this.welcomeUser.textContent = `Olá, ${this.currentUser.name}!`;
        } else {
            this.loginSection.classList.remove('hidden');
            this.userSection.classList.add('hidden');
        }
    }

    openLoginModal() {
        this.loginModal.classList.remove('hidden');
        document.getElementById('loginUsername').focus();
    }

    openRegisterModal() {
        this.registerModal.classList.remove('hidden');
        document.getElementById('registerName').focus();
    }

    toggleUserDropdown() {
        this.userDropdown.classList.toggle('hidden');
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.updateUserInterface();
            this.loginModal.classList.add('hidden');
            document.getElementById('loginForm').reset();
            this.loadInitialRoadmaps();
        } else {
            this.showNotification('Erro de Login', 'Usuário ou senha incorretos!', 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        
        if (this.users.find(u => u.username === username)) {
            this.showNotification('Erro de Cadastro', 'Usuário já existe!', 'error');
            return;
        }
        
        const newUser = {
            id: Date.now().toString(),
            username,
            password,
            name
        };
        
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        this.updateUserInterface();
        this.registerModal.classList.add('hidden');
        document.getElementById('registerForm').reset();
        
        this.showNotification('Sucesso!', 'Cadastro realizado com sucesso!', 'success');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUserInterface();
        this.userDropdown.classList.add('hidden');
        this.loadInitialRoadmaps();
    }

    openMyRoadmaps() {
        if (!this.currentUser) return;
        
        const myRoadmaps = this.userRoadmaps.filter(r => r.authorId === this.currentUser.id);
        const container = document.getElementById('myRoadmapsList');
        
        if (myRoadmaps.length === 0) {
            container.innerHTML = '<p>Você ainda não criou nenhum roadmap.</p>';
        } else {
            container.innerHTML = myRoadmaps.map(roadmap => `
                <div class="roadmap-item">
                    <div>
                        <h4>${roadmap.title}</h4>
                        <p>${roadmap.description}</p>
                    </div>
                    <div class="roadmap-actions">
                        <button class="edit-btn" onclick="app.editRoadmap('${roadmap.id}')">Editar</button>
                        <button class="delete-btn" onclick="app.deleteRoadmap('${roadmap.id}')">Excluir</button>
                    </div>
                </div>
            `).join('');
        }
        
        this.myRoadmapsModal.classList.remove('hidden');
        this.userDropdown.classList.add('hidden');
    }

    openFavorites() {
        if (!this.currentUser) return;
        
        const userFavorites = this.favorites.filter(f => f.userId === this.currentUser.id);
        const allRoadmaps = [...this.getMockRoadmaps(), ...this.userRoadmaps];
        const favoriteRoadmaps = userFavorites.map(f => allRoadmaps.find(r => r.id === f.roadmapId)).filter(Boolean);
        
        const container = document.getElementById('favoritesList');
        
        if (favoriteRoadmaps.length === 0) {
            container.innerHTML = '<p>Você ainda não tem roadmaps favoritos.</p>';
        } else {
            container.innerHTML = favoriteRoadmaps.map(roadmap => `
                <div class="roadmap-item">
                    <div>
                        <h4>${roadmap.title}</h4>
                        <p>${roadmap.description}</p>
                        <small>por ${roadmap.author}</small>
                    </div>
                    <div class="roadmap-actions">
                        <button class="favorite-btn" onclick="app.removeFavorite('${roadmap.id}')">Remover</button>
                    </div>
                </div>
            `).join('');
        }
        
        this.favoritesModal.classList.remove('hidden');
        this.userDropdown.classList.add('hidden');
    }

    openCompleted() {
        if (!this.currentUser) return;
        
        const userCompleted = this.completed.filter(c => c.userId === this.currentUser.id);
        const allRoadmaps = [...this.getMockRoadmaps(), ...this.userRoadmaps];
        const completedRoadmaps = userCompleted.map(c => allRoadmaps.find(r => r.id === c.roadmapId)).filter(Boolean);
        
        const container = document.getElementById('completedList');
        
        if (completedRoadmaps.length === 0) {
            container.innerHTML = '<p>Você ainda não concluiu nenhum roadmap.</p>';
        } else {
            container.innerHTML = completedRoadmaps.map(roadmap => `
                <div class="roadmap-item">
                    <div>
                        <h4>${roadmap.title}</h4>
                        <p>${roadmap.description}</p>
                        <small>por ${roadmap.author}</small>
                    </div>
                    <div class="roadmap-actions">
                        <button class="complete-btn" onclick="app.removeCompleted('${roadmap.id}')">Desmarcar</button>
                    </div>
                </div>
            `).join('');
        }
        
        this.completedModal.classList.remove('hidden');
        this.userDropdown.classList.add('hidden');
    }

    toggleFavorite(roadmapId) {
        if (!this.currentUser) {
            this.showNotification('Login Necessário', 'Faça login para favoritar roadmaps!', 'warning');
            return;
        }
        
        const existingFavorite = this.favorites.find(f => f.userId === this.currentUser.id && f.roadmapId === roadmapId);
        
        if (existingFavorite) {
            this.favorites = this.favorites.filter(f => f !== existingFavorite);
        } else {
            this.favorites.push({
                userId: this.currentUser.id,
                roadmapId: roadmapId,
                date: new Date().toISOString()
            });
        }
        
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    toggleCompleted(roadmapId) {
        if (!this.currentUser) {
            this.showNotification('Login Necessário', 'Faça login para marcar roadmaps como concluídos!', 'warning');
            return;
        }
        
        const existingCompleted = this.completed.find(c => c.userId === this.currentUser.id && c.roadmapId === roadmapId);
        
        if (existingCompleted) {
            this.completed = this.completed.filter(c => c !== existingCompleted);
        } else {
            this.completed.push({
                userId: this.currentUser.id,
                roadmapId: roadmapId,
                date: new Date().toISOString()
            });
        }
        
        localStorage.setItem('completed', JSON.stringify(this.completed));
        this.search(); // Recarregar para atualizar visual dos cards
    }

    removeFavorite(roadmapId) {
        this.favorites = this.favorites.filter(f => !(f.userId === this.currentUser.id && f.roadmapId === roadmapId));
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.openFavorites();
    }

    removeCompleted(roadmapId) {
        this.completed = this.completed.filter(c => !(c.userId === this.currentUser.id && c.roadmapId === roadmapId));
        localStorage.setItem('completed', JSON.stringify(this.completed));
        this.openCompleted();
    }

    editRoadmap(roadmapId) {
        const roadmap = this.userRoadmaps.find(r => r.id === roadmapId);
        if (!roadmap || roadmap.authorId !== this.currentUser.id) return;
        
        // Preencher formulário com dados existentes
        document.getElementById('authorName').value = roadmap.author;
        document.getElementById('roadmapTitle').value = roadmap.title;
        document.getElementById('roadmapTopic').value = roadmap.topic;
        document.getElementById('roadmapCategory').value = roadmap.category;
        document.getElementById('roadmapDifficulty').value = roadmap.difficulty;
        document.getElementById('roadmapDescription').value = roadmap.description;
        
        // Preencher passos
        const container = document.getElementById('stepsContainer');
        container.innerHTML = roadmap.steps.map((step, index) => `
            <div class="step-input">
                <input type="text" placeholder="Título do passo ${index + 1}" class="step-title" value="${step.title}" required>
                <textarea placeholder="Descrição do passo ${index + 1}" class="step-description" required>${step.description}</textarea>
                ${index >= 3 ? '<button type="button" class="remove-step" onclick="this.parentElement.remove()">Remover</button>' : ''}
            </div>
        `).join('');
        
        // Marcar como edição
        this.createForm.dataset.editId = roadmapId;
        document.getElementById('submitRoadmap').textContent = 'Atualizar Roadmap';
        
        this.myRoadmapsModal.classList.add('hidden');
        this.createModal.classList.remove('hidden');
    }

    deleteRoadmap(roadmapId) {
        if (!confirm('Tem certeza que deseja excluir este roadmap?')) return;
        
        this.userRoadmaps = this.userRoadmaps.filter(r => r.id !== roadmapId);
        localStorage.setItem('userRoadmaps', JSON.stringify(this.userRoadmaps));
        
        // Remover dos favoritos e concluídos
        this.favorites = this.favorites.filter(f => f.roadmapId !== roadmapId);
        this.completed = this.completed.filter(c => c.roadmapId !== roadmapId);
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        localStorage.setItem('completed', JSON.stringify(this.completed));
        
        this.openMyRoadmaps();
        this.search();
    }

    async loadInitialRoadmaps() {
        this.showLoading();
        setTimeout(() => {
            const roadmaps = this.getMockRoadmaps();
            this.displayResults(roadmaps);
        }, 500);
    }

    async search() {
        const query = this.searchInput.value.trim();
        const difficulty = this.difficultyFilter.value;
        const category = this.categoryFilter.value;
        
        this.showLoading();
        
        setTimeout(() => {
            const roadmaps = this.getMockRoadmaps(query, difficulty, category);
            this.displayResults(roadmaps);
        }, 300);
    }
    
    clearAllFilters() {
        this.searchInput.value = '';
        this.difficultyFilter.value = '';
        this.categoryFilter.value = '';
        this.search();
    }

    openCreateModal() {
        if (!this.currentUser) {
            this.showNotification('Login Necessário', 'Faça login para criar roadmaps!', 'warning');
            return;
        }
        
        // Resetar formulário
        this.createForm.reset();
        delete this.createForm.dataset.editId;
        document.getElementById('submitRoadmap').textContent = 'Criar Roadmap';
        document.getElementById('authorName').value = this.currentUser.name;
        
        this.createModal.classList.remove('hidden');
        document.getElementById('roadmapTitle').focus();
    }

    getMockRoadmaps(query = '', difficulty = '', category = '') {
        const mockData = [
            {id: '1', title: 'Algoritmos e Estruturas de Dados', topic: 'algoritmos', category: 'backend', author: 'StudyMaster', description: 'Domine os fundamentos da programação com algoritmos essenciais e estruturas de dados.', difficulty: 'Intermediário', steps: [{title: 'Arrays e Listas', description: 'Aprenda sobre estruturas lineares básicas'}, {title: 'Pilhas e Filas', description: 'Estruturas LIFO e FIFO'}, {title: 'Árvores', description: 'Árvores binárias e algoritmos de busca'}, {title: 'Grafos', description: 'Representação e algoritmos em grafos'}, {title: 'Algoritmos de Ordenação', description: 'QuickSort, MergeSort, HeapSort'}]},
            {id: '2', title: 'JavaScript Moderno', topic: 'javascript', category: 'web', author: 'StudyMaster', description: 'Aprenda JavaScript do básico ao avançado com ES6+ e frameworks modernos.', difficulty: 'Iniciante', steps: [{title: 'Fundamentos JS', description: 'Variáveis, funções, objetos'}, {title: 'ES6+ Features', description: 'Arrow functions, destructuring, modules'}, {title: 'DOM Manipulation', description: 'Interação com elementos HTML'}, {title: 'Async Programming', description: 'Promises, async/await'}, {title: 'Frameworks', description: 'React, Vue ou Angular'}]},
            {id: '3', title: 'Python para Data Science', topic: 'python', category: 'data', author: 'StudyMaster', description: 'Trilha completa para se tornar um cientista de dados usando Python.', difficulty: 'Intermediário', steps: [{title: 'Python Básico', description: 'Sintaxe e estruturas fundamentais'}, {title: 'NumPy e Pandas', description: 'Manipulação de dados'}, {title: 'Matplotlib e Seaborn', description: 'Visualização de dados'}, {title: 'Machine Learning', description: 'Scikit-learn e algoritmos ML'}, {title: 'Deep Learning', description: 'TensorFlow e PyTorch'}]},
            {id: '4', title: 'React Development', topic: 'react', category: 'web', author: 'StudyMaster', description: 'Construa aplicações web modernas com React e seu ecossistema.', difficulty: 'Intermediário', steps: [{title: 'JSX e Components', description: 'Fundamentos do React'}, {title: 'State e Props', description: 'Gerenciamento de estado'}, {title: 'Hooks', description: 'useState, useEffect e hooks customizados'}, {title: 'Context API', description: 'Gerenciamento global de estado'}, {title: 'Next.js', description: 'Framework React para produção'}]},
            {id: '5', title: 'DevOps com AWS', topic: 'devops', category: 'devops', author: 'StudyMaster', description: 'Aprenda práticas DevOps usando serviços AWS.', difficulty: 'Avançado', steps: [{title: 'AWS Basics', description: 'EC2, S3, IAM fundamentals'}, {title: 'Docker', description: 'Containerização de aplicações'}, {title: 'CI/CD', description: 'CodePipeline, CodeBuild, CodeDeploy'}, {title: 'Infrastructure as Code', description: 'CloudFormation e Terraform'}, {title: 'Monitoring', description: 'CloudWatch, X-Ray, logging'}]},
            {id: '6', title: 'Node.js Backend', topic: 'nodejs', category: 'backend', author: 'StudyMaster', description: 'Desenvolva APIs robustas e escaláveis com Node.js.', difficulty: 'Intermediário', steps: [{title: 'Node.js Fundamentals', description: 'Event loop, modules, npm'}, {title: 'Express.js', description: 'Framework web para APIs'}, {title: 'Database Integration', description: 'MongoDB, PostgreSQL'}, {title: 'Authentication', description: 'JWT, OAuth, sessions'}, {title: 'Testing & Deployment', description: 'Jest, Docker, PM2'}]},
            {id: '7', title: 'Vue.js Development', topic: 'vue', category: 'web', author: 'StudyMaster', description: 'Crie interfaces reativas e elegantes com Vue.js.', difficulty: 'Iniciante', steps: [{title: 'Vue Basics', description: 'Templates, directives, data binding'}, {title: 'Components', description: 'Single File Components, props, events'}, {title: 'Vue Router', description: 'Navegação e roteamento'}, {title: 'Vuex/Pinia', description: 'Gerenciamento de estado'}, {title: 'Nuxt.js', description: 'Framework Vue para produção'}]},
            {id: '8', title: 'Angular Development', topic: 'angular', category: 'web', author: 'StudyMaster', description: 'Desenvolva aplicações enterprise com Angular.', difficulty: 'Avançado', steps: [{title: 'TypeScript', description: 'Fundamentos da linguagem'}, {title: 'Components & Services', description: 'Arquitetura Angular'}, {title: 'Routing & Guards', description: 'Navegação e proteção de rotas'}, {title: 'RxJS', description: 'Programação reativa'}, {title: 'Testing', description: 'Jasmine, Karma, Protractor'}]},
            {id: '9', title: 'Machine Learning', topic: 'ml', category: 'data', author: 'StudyMaster', description: 'Domine algoritmos de aprendizado de máquina.', difficulty: 'Avançado', steps: [{title: 'Matemática para ML', description: 'Álgebra linear, estatística'}, {title: 'Supervised Learning', description: 'Regressão, classificação'}, {title: 'Unsupervised Learning', description: 'Clustering, PCA'}, {title: 'Deep Learning', description: 'Neural networks, CNN, RNN'}, {title: 'MLOps', description: 'Deploy e monitoramento de modelos'}]},
            {id: '10', title: 'Java Spring Boot', topic: 'java', category: 'backend', author: 'StudyMaster', description: 'Construa aplicações Java robustas com Spring Boot.', difficulty: 'Intermediário', steps: [{title: 'Java Fundamentals', description: 'OOP, collections, streams'}, {title: 'Spring Core', description: 'Dependency injection, beans'}, {title: 'Spring Boot', description: 'Auto-configuration, starters'}, {title: 'Spring Data JPA', description: 'Persistência de dados'}, {title: 'Spring Security', description: 'Autenticação e autorização'}]},
            {id: '11', title: 'C# .NET Development', topic: 'csharp', category: 'backend', author: 'StudyMaster', description: 'Desenvolva aplicações modernas com C# e .NET.', difficulty: 'Intermediário', steps: [{title: 'C# Fundamentals', description: 'Sintaxe, OOP, LINQ'}, {title: 'ASP.NET Core', description: 'Web APIs e MVC'}, {title: 'Entity Framework', description: 'ORM para .NET'}, {title: 'Blazor', description: 'Web apps com C#'}, {title: 'Azure Integration', description: 'Deploy e serviços cloud'}]},
            {id: '12', title: 'Go Programming', topic: 'go', category: 'backend', author: 'StudyMaster', description: 'Aprenda Go para sistemas distribuídos e microserviços.', difficulty: 'Intermediário', steps: [{title: 'Go Basics', description: 'Sintaxe, goroutines, channels'}, {title: 'Web Development', description: 'Gin, Echo frameworks'}, {title: 'Database Integration', description: 'GORM, SQL drivers'}, {title: 'Microservices', description: 'gRPC, Docker, Kubernetes'}, {title: 'Testing & Profiling', description: 'Benchmarks, pprof'}]},
            {id: '13', title: 'Rust Programming', topic: 'rust', category: 'backend', author: 'StudyMaster', description: 'Programação de sistemas segura e performática com Rust.', difficulty: 'Avançado', steps: [{title: 'Ownership & Borrowing', description: 'Sistema de memória do Rust'}, {title: 'Structs & Enums', description: 'Tipos de dados customizados'}, {title: 'Error Handling', description: 'Result, Option, panic!'}, {title: 'Concurrency', description: 'Threads, async/await'}, {title: 'Web Development', description: 'Actix, Rocket frameworks'}]},
            {id: '14', title: 'Flutter Mobile', topic: 'flutter', category: 'mobile', author: 'StudyMaster', description: 'Desenvolva apps mobile multiplataforma com Flutter.', difficulty: 'Intermediário', steps: [{title: 'Dart Language', description: 'Sintaxe e conceitos básicos'}, {title: 'Widgets & Layouts', description: 'UI components do Flutter'}, {title: 'State Management', description: 'Provider, Bloc, Riverpod'}, {title: 'Navigation & Routing', description: 'Navegação entre telas'}, {title: 'Platform Integration', description: 'APIs nativas, plugins'}]},
            {id: '15', title: 'React Native', topic: 'reactnative', category: 'mobile', author: 'StudyMaster', description: 'Crie apps mobile com React Native.', difficulty: 'Intermediário', steps: [{title: 'React Native Basics', description: 'Components, JSX, styling'}, {title: 'Navigation', description: 'React Navigation library'}, {title: 'State Management', description: 'Redux, Context API'}, {title: 'Native Modules', description: 'Integração com código nativo'}, {title: 'Publishing', description: 'App Store, Google Play'}]},
            {id: '16', title: 'iOS Development', topic: 'ios', category: 'mobile', author: 'StudyMaster', description: 'Desenvolva apps nativos para iOS com Swift.', difficulty: 'Avançado', steps: [{title: 'Swift Language', description: 'Sintaxe e conceitos fundamentais'}, {title: 'UIKit', description: 'Interface de usuário tradicional'}, {title: 'SwiftUI', description: 'Framework moderno de UI'}, {title: 'Core Data', description: 'Persistência de dados'}, {title: 'App Store', description: 'Publicação e guidelines'}]},
            {id: '17', title: 'Android Development', topic: 'android', category: 'mobile', author: 'StudyMaster', description: 'Crie apps Android nativos com Kotlin.', difficulty: 'Avançado', steps: [{title: 'Kotlin Language', description: 'Sintaxe e interop com Java'}, {title: 'Android Components', description: 'Activities, Fragments, Services'}, {title: 'Jetpack Compose', description: 'UI moderna declarativa'}, {title: 'Room Database', description: 'Persistência local'}, {title: 'Google Play', description: 'Publicação e monetização'}]},
            {id: '18', title: 'Docker & Containers', topic: 'docker', category: 'devops', author: 'StudyMaster', description: 'Containerize aplicações com Docker e orquestração.', difficulty: 'Intermediário', steps: [{title: 'Docker Basics', description: 'Images, containers, Dockerfile'}, {title: 'Docker Compose', description: 'Multi-container applications'}, {title: 'Kubernetes', description: 'Orquestração de containers'}, {title: 'Registry & Security', description: 'Docker Hub, image scanning'}, {title: 'Production Deployment', description: 'Best practices, monitoring'}]},
            {id: '19', title: 'Kubernetes', topic: 'kubernetes', category: 'devops', author: 'StudyMaster', description: 'Orquestre containers em escala com Kubernetes.', difficulty: 'Avançado', steps: [{title: 'K8s Architecture', description: 'Pods, nodes, clusters'}, {title: 'Deployments & Services', description: 'Gerenciamento de aplicações'}, {title: 'ConfigMaps & Secrets', description: 'Configuração e segurança'}, {title: 'Ingress & Networking', description: 'Exposição de serviços'}, {title: 'Monitoring & Logging', description: 'Observabilidade'}]},
            {id: '20', title: 'GraphQL', topic: 'graphql', category: 'backend', author: 'StudyMaster', description: 'APIs flexíveis e eficientes com GraphQL.', difficulty: 'Intermediário', steps: [{title: 'GraphQL Basics', description: 'Schema, queries, mutations'}, {title: 'Apollo Server', description: 'Servidor GraphQL'}, {title: 'Apollo Client', description: 'Cliente para frontend'}, {title: 'Subscriptions', description: 'Real-time updates'}, {title: 'Performance', description: 'Caching, batching, optimization'}]},
            {id: '21', title: 'MongoDB', topic: 'mongodb', category: 'backend', author: 'StudyMaster', description: 'Banco de dados NoSQL para aplicações modernas.', difficulty: 'Iniciante', steps: [{title: 'MongoDB Basics', description: 'Documents, collections, CRUD'}, {title: 'Aggregation Pipeline', description: 'Processamento de dados'}, {title: 'Indexing', description: 'Performance e otimização'}, {title: 'Replication', description: 'Alta disponibilidade'}, {title: 'Sharding', description: 'Escalabilidade horizontal'}]},
            {id: '22', title: 'PostgreSQL', topic: 'postgresql', category: 'backend', author: 'StudyMaster', description: 'Banco relacional avançado para aplicações críticas.', difficulty: 'Intermediário', steps: [{title: 'SQL Fundamentals', description: 'Queries, joins, functions'}, {title: 'Advanced Features', description: 'JSON, arrays, custom types'}, {title: 'Performance Tuning', description: 'Indexes, query optimization'}, {title: 'Replication & Backup', description: 'Alta disponibilidade'}, {title: 'Extensions', description: 'PostGIS, pg_stat_statements'}]},
            {id: '23', title: 'Redis', topic: 'redis', category: 'backend', author: 'StudyMaster', description: 'Cache e estruturas de dados em memória.', difficulty: 'Iniciante', steps: [{title: 'Redis Basics', description: 'Strings, hashes, lists, sets'}, {title: 'Pub/Sub', description: 'Messaging patterns'}, {title: 'Lua Scripting', description: 'Scripts atômicos'}, {title: 'Persistence', description: 'RDB, AOF'}, {title: 'Clustering', description: 'Escalabilidade e HA'}]},
            {id: '24', title: 'Elasticsearch', topic: 'elasticsearch', category: 'data', author: 'StudyMaster', description: 'Search engine e analytics distribuído.', difficulty: 'Avançado', steps: [{title: 'ES Fundamentals', description: 'Documents, indices, mappings'}, {title: 'Query DSL', description: 'Search e aggregations'}, {title: 'ELK Stack', description: 'Logstash, Kibana integration'}, {title: 'Performance', description: 'Sharding, replicas, optimization'}, {title: 'Security', description: 'Authentication, authorization'}]},
            {id: '25', title: 'Terraform', topic: 'terraform', category: 'devops', author: 'StudyMaster', description: 'Infrastructure as Code com Terraform.', difficulty: 'Intermediário', steps: [{title: 'HCL Syntax', description: 'HashiCorp Configuration Language'}, {title: 'Providers & Resources', description: 'AWS, Azure, GCP'}, {title: 'State Management', description: 'Remote state, locking'}, {title: 'Modules', description: 'Reusable infrastructure'}, {title: 'Best Practices', description: 'Security, testing, CI/CD'}]},
            {id: '26', title: 'Ansible', topic: 'ansible', category: 'devops', author: 'StudyMaster', description: 'Automação de configuração e deployment.', difficulty: 'Intermediário', steps: [{title: 'Ansible Basics', description: 'Playbooks, tasks, modules'}, {title: 'Inventory Management', description: 'Hosts, groups, variables'}, {title: 'Roles & Collections', description: 'Reusable automation'}, {title: 'Ansible Vault', description: 'Secrets management'}, {title: 'AWX/Tower', description: 'Enterprise automation'}]},
            {id: '27', title: 'Jenkins CI/CD', topic: 'jenkins', category: 'devops', author: 'StudyMaster', description: 'Continuous Integration e Deployment.', difficulty: 'Intermediário', steps: [{title: 'Jenkins Setup', description: 'Installation, configuration'}, {title: 'Pipeline as Code', description: 'Jenkinsfile, declarative syntax'}, {title: 'Plugins & Integrations', description: 'Git, Docker, testing tools'}, {title: 'Security', description: 'RBAC, credentials management'}, {title: 'Scaling', description: 'Master-slave, distributed builds'}]},
            {id: '28', title: 'GitHub Actions', topic: 'github', category: 'devops', author: 'StudyMaster', description: 'CI/CD nativo do GitHub.', difficulty: 'Iniciante', steps: [{title: 'Workflow Basics', description: 'YAML syntax, triggers'}, {title: 'Actions Marketplace', description: 'Reusable actions'}, {title: 'Secrets & Environments', description: 'Security e deployment'}, {title: 'Matrix Builds', description: 'Multiple OS/versions'}, {title: 'Custom Actions', description: 'JavaScript, Docker actions'}]},
            {id: '29', title: 'Cybersecurity', topic: 'security', category: 'devops', author: 'StudyMaster', description: 'Fundamentos de segurança cibernética.', difficulty: 'Avançado', steps: [{title: 'Security Fundamentals', description: 'CIA triad, threat modeling'}, {title: 'Network Security', description: 'Firewalls, VPN, IDS/IPS'}, {title: 'Web Security', description: 'OWASP Top 10, penetration testing'}, {title: 'Cryptography', description: 'Encryption, hashing, PKI'}, {title: 'Incident Response', description: 'Forensics, recovery'}]},
            {id: '30', title: 'Blockchain Development', topic: 'blockchain', category: 'web', author: 'StudyMaster', description: 'Desenvolva aplicações descentralizadas.', difficulty: 'Avançado', steps: [{title: 'Blockchain Basics', description: 'Distributed ledger, consensus'}, {title: 'Ethereum & Solidity', description: 'Smart contracts development'}, {title: 'Web3.js', description: 'Frontend integration'}, {title: 'DeFi Protocols', description: 'Decentralized finance'}, {title: 'NFTs & DAOs', description: 'Non-fungible tokens, governance'}]},
            {id: '31', title: 'Unity Game Development', topic: 'unity', category: 'game', author: 'StudyMaster', description: 'Crie jogos 2D e 3D com Unity.', difficulty: 'Intermediário', steps: [{title: 'Unity Interface', description: 'Editor, scenes, GameObjects'}, {title: 'C# Scripting', description: 'MonoBehaviour, coroutines'}, {title: 'Physics & Animation', description: 'Rigidbody, Animator'}, {title: 'UI & Audio', description: 'Canvas, AudioSource'}, {title: 'Publishing', description: 'Build settings, platforms'}]},
            {id: '32', title: 'Unreal Engine', topic: 'unreal', category: 'game', author: 'StudyMaster', description: 'Desenvolvimento de jogos AAA com Unreal.', difficulty: 'Avançado', steps: [{title: 'UE5 Basics', description: 'Editor, blueprints, actors'}, {title: 'C++ Programming', description: 'UObject, components'}, {title: 'Materials & Lighting', description: 'Shaders, Lumen'}, {title: 'Animation & AI', description: 'Behavior trees, state machines'}, {title: 'Multiplayer', description: 'Replication, dedicated servers'}]},
            {id: '33', title: 'Godot Game Engine', topic: 'godot', category: 'game', author: 'StudyMaster', description: 'Engine open-source para jogos indie.', difficulty: 'Iniciante', steps: [{title: 'Godot Basics', description: 'Nodes, scenes, signals'}, {title: 'GDScript', description: 'Python-like scripting'}, {title: '2D Development', description: 'Sprites, tilemaps, physics'}, {title: '3D Development', description: 'Meshes, materials, lighting'}, {title: 'Export & Publishing', description: 'Multiple platforms'}]},
            {id: '34', title: 'Blender 3D', topic: 'blender', category: 'design', author: 'StudyMaster', description: 'Modelagem, animação e rendering 3D.', difficulty: 'Intermediário', steps: [{title: 'Interface & Navigation', description: 'Viewport, shortcuts'}, {title: 'Modeling', description: 'Mesh editing, modifiers'}, {title: 'Materials & Texturing', description: 'Shader editor, UV mapping'}, {title: 'Animation', description: 'Keyframes, rigging'}, {title: 'Rendering', description: 'Cycles, Eevee engines'}]},
            {id: '35', title: 'Adobe After Effects', topic: 'aftereffects', category: 'design', author: 'StudyMaster', description: 'Motion graphics e efeitos visuais.', difficulty: 'Intermediário', steps: [{title: 'AE Interface', description: 'Timeline, composition, layers'}, {title: 'Animation Principles', description: 'Keyframes, easing, timing'}, {title: 'Effects & Presets', description: 'Built-in effects library'}, {title: 'Expressions', description: 'JavaScript-based automation'}, {title: 'Rendering & Export', description: 'Media Encoder, formats'}]},
            {id: '36', title: 'Figma Design', topic: 'figma', category: 'design', author: 'StudyMaster', description: 'Design de interfaces e prototipagem.', difficulty: 'Iniciante', steps: [{title: 'Figma Basics', description: 'Frames, shapes, text'}, {title: 'Components & Variants', description: 'Design systems'}, {title: 'Prototyping', description: 'Interactions, transitions'}, {title: 'Collaboration', description: 'Comments, sharing, handoff'}, {title: 'Plugins & Automation', description: 'Extending functionality'}]},
            {id: '37', title: 'UI/UX Design', topic: 'ux', category: 'design', author: 'StudyMaster', description: 'Design centrado no usuário.', difficulty: 'Intermediário', steps: [{title: 'Design Thinking', description: 'User research, personas'}, {title: 'Information Architecture', description: 'Sitemaps, user flows'}, {title: 'Wireframing', description: 'Low-fi prototypes'}, {title: 'Visual Design', description: 'Typography, color, layout'}, {title: 'Usability Testing', description: 'User feedback, iteration'}]},
            {id: '38', title: 'Digital Marketing', topic: 'marketing', category: 'business', author: 'StudyMaster', description: 'Marketing digital e growth hacking.', difficulty: 'Iniciante', steps: [{title: 'Marketing Fundamentals', description: 'Customer journey, funnel'}, {title: 'SEO & Content', description: 'Search optimization, blogging'}, {title: 'Social Media', description: 'Platform strategies, engagement'}, {title: 'Paid Advertising', description: 'Google Ads, Facebook Ads'}, {title: 'Analytics', description: 'Google Analytics, conversion tracking'}]},
            {id: '39', title: 'Data Engineering', topic: 'dataeng', category: 'data', author: 'StudyMaster', description: 'Pipelines de dados e big data.', difficulty: 'Avançado', steps: [{title: 'Data Fundamentals', description: 'ETL, data warehousing'}, {title: 'Apache Spark', description: 'Distributed data processing'}, {title: 'Apache Kafka', description: 'Stream processing'}, {title: 'Cloud Platforms', description: 'AWS, GCP, Azure data services'}, {title: 'Data Governance', description: 'Quality, lineage, security'}]},
            {id: '40', title: 'Cloud Architecture', topic: 'cloud', category: 'devops', author: 'StudyMaster', description: 'Arquitetura de soluções em nuvem.', difficulty: 'Avançado', steps: [{title: 'Cloud Fundamentals', description: 'IaaS, PaaS, SaaS'}, {title: 'Multi-Cloud Strategy', description: 'AWS, Azure, GCP'}, {title: 'Microservices', description: 'Service mesh, API gateway'}, {title: 'Serverless', description: 'Functions, event-driven architecture'}, {title: 'Cost Optimization', description: 'Resource management, monitoring'}]},
            {id: '41', title: 'Product Management', topic: 'product', category: 'business', author: 'StudyMaster', description: 'Gestão de produtos digitais.', difficulty: 'Intermediário', steps: [{title: 'Product Strategy', description: 'Vision, roadmap, OKRs'}, {title: 'User Research', description: 'Interviews, surveys, analytics'}, {title: 'Agile Methodologies', description: 'Scrum, Kanban, Lean'}, {title: 'Feature Prioritization', description: 'RICE, MoSCoW, Kano model'}, {title: 'Metrics & KPIs', description: 'Product analytics, A/B testing'}]},
            {id: '42', title: 'Scrum Master', topic: 'scrum', category: 'business', author: 'StudyMaster', description: 'Facilitação ágil e liderança de equipes.', difficulty: 'Intermediário', steps: [{title: 'Agile Principles', description: 'Manifesto ágil, valores'}, {title: 'Scrum Framework', description: 'Roles, events, artifacts'}, {title: 'Facilitation Skills', description: 'Meetings, retrospectives'}, {title: 'Team Coaching', description: 'Conflict resolution, motivation'}, {title: 'Scaling Agile', description: 'SAFe, LeSS, Nexus'}]}
        ];

        // Combinar roadmaps padrão com roadmaps do usuário
        const allRoadmaps = [...mockData, ...this.userRoadmaps];
        let filteredData = allRoadmaps;

        // Filtrar por busca de texto
        if (query) {
            filteredData = filteredData.filter(roadmap => 
                roadmap.title.toLowerCase().includes(query.toLowerCase()) ||
                roadmap.topic.toLowerCase().includes(query.toLowerCase()) ||
                roadmap.description.toLowerCase().includes(query.toLowerCase())
            );
        }

        // Filtrar por dificuldade
        if (difficulty) {
            filteredData = filteredData.filter(roadmap => roadmap.difficulty === difficulty);
        }

        // Filtrar por categoria
        if (category) {
            filteredData = filteredData.filter(roadmap => roadmap.category === category);
        }

        return filteredData;
    }

    displayResults(roadmaps) {
        this.hideLoading();
        
        if (roadmaps.length === 0) {
            this.showNoResults();
            return;
        }

        this.results.innerHTML = roadmaps.map(roadmap => {
            const isFavorite = this.currentUser && this.favorites.some(f => f.userId === this.currentUser.id && f.roadmapId === roadmap.id);
            const isCompleted = this.currentUser && this.completed.some(c => c.userId === this.currentUser.id && c.roadmapId === roadmap.id);
            
            return `
                <div class="roadmap-card ${isCompleted ? 'completed' : ''}" onclick="app.showRoadmapDetails('${roadmap.id}')">
                    <div class="topic">${roadmap.topic}</div>
                    <h3>${roadmap.title}</h3>
                    <p>${roadmap.description}</p>
                    <div class="difficulty">
                        <i class="fas fa-signal"></i>
                        <span>${roadmap.difficulty}</span>
                    </div>
                    <div class="author">por ${roadmap.author}</div>
                    ${this.currentUser ? `
                        <div class="card-actions" onclick="event.stopPropagation()">
                            <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="app.toggleFavorite('${roadmap.id}')" title="Favoritar">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="complete-btn ${isCompleted ? 'active' : ''}" onclick="app.toggleCompleted('${roadmap.id}')" title="Marcar como concluído">
                                <i class="fas fa-check-circle"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    async showRoadmapDetails(roadmapId) {
        const allRoadmaps = [...this.getMockRoadmaps(), ...this.userRoadmaps];
        const roadmap = allRoadmaps.find(r => r.id === roadmapId);
        
        if (!roadmap) return;

        const isFavorite = this.currentUser && this.favorites.some(f => f.userId === this.currentUser.id && f.roadmapId === roadmap.id);
        const isCompleted = this.currentUser && this.completed.some(c => c.userId === this.currentUser.id && c.roadmapId === roadmap.id);

        this.roadmapDetails.innerHTML = `
            <h2>${roadmap.title}</h2>
            <div class="topic">${roadmap.topic}</div>
            <p style="margin: 1rem 0; color: #666;">${roadmap.description}</p>
            <div class="difficulty" style="margin-bottom: 1rem;">
                <i class="fas fa-signal"></i>
                <span>${roadmap.difficulty}</span>
            </div>
            <div class="author" style="margin-bottom: 2rem; font-style: italic; color: #888;">Criado por: ${roadmap.author}</div>
            
            ${this.currentUser ? `
                <div class="modal-actions" style="margin-bottom: 2rem;">
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="app.toggleFavorite('${roadmap.id}'); app.showRoadmapDetails('${roadmap.id}')">
                        <i class="fas fa-heart"></i> ${isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                    </button>
                    <button class="complete-btn ${isCompleted ? 'active' : ''}" onclick="app.toggleCompleted('${roadmap.id}'); app.showRoadmapDetails('${roadmap.id}')">
                        <i class="fas fa-check-circle"></i> ${isCompleted ? 'Desmarcar Concluído' : 'Marcar como Concluído'}
                    </button>
                </div>
            ` : ''}
            
            <h3>Roadmap de Estudos:</h3>
            ${roadmap.steps.map((step, index) => `
                <div class="roadmap-step">
                    <h4>${index + 1}. ${step.title}</h4>
                    <p>${step.description}</p>
                </div>
            `).join('')}
        `;

        this.modal.classList.remove('hidden');
    }

    addStep() {
        const container = document.getElementById('stepsContainer');
        const stepCount = container.children.length + 1;
        
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-input';
        stepDiv.innerHTML = `
            <input type="text" placeholder="Título do passo ${stepCount}" class="step-title" required>
            <textarea placeholder="Descrição do passo ${stepCount}" class="step-description" required></textarea>
            <button type="button" class="remove-step" onclick="this.parentElement.remove()">Remover</button>
        `;
        
        container.appendChild(stepDiv);
    }
    
    handleCreateSubmit(e) {
        e.preventDefault();
        
        const formData = {
            id: this.createForm.dataset.editId || Date.now().toString(),
            title: document.getElementById('roadmapTitle').value,
            topic: document.getElementById('roadmapTopic').value.toLowerCase(),
            category: document.getElementById('roadmapCategory').value,
            difficulty: document.getElementById('roadmapDifficulty').value,
            description: document.getElementById('roadmapDescription').value,
            author: document.getElementById('authorName').value,
            authorId: this.currentUser.id,
            steps: []
        };
        
        // Coletar passos
        const stepInputs = document.querySelectorAll('.step-input');
        stepInputs.forEach(stepInput => {
            const title = stepInput.querySelector('.step-title').value;
            const description = stepInput.querySelector('.step-description').value;
            
            if (title && description) {
                formData.steps.push({ title, description });
            }
        });
        
        if (formData.steps.length < 3) {
            this.showNotification('Erro de Validação', 'Por favor, adicione pelo menos 3 passos ao roadmap.', 'error');
            return;
        }
        
        if (this.createForm.dataset.editId) {
            // Atualizar roadmap existente
            const index = this.userRoadmaps.findIndex(r => r.id === formData.id);
            if (index !== -1) {
                this.userRoadmaps[index] = formData;
            }
        } else {
            // Criar novo roadmap
            this.userRoadmaps.push(formData);
        }
        
        localStorage.setItem('userRoadmaps', JSON.stringify(this.userRoadmaps));
        
        // Fechar modal e resetar form
        this.createModal.classList.add('hidden');
        this.createForm.reset();
        delete this.createForm.dataset.editId;
        document.getElementById('submitRoadmap').textContent = 'Criar Roadmap';
        
        // Resetar passos para 3 iniciais
        const container = document.getElementById('stepsContainer');
        container.innerHTML = `
            <div class="step-input">
                <input type="text" placeholder="Título do passo 1" class="step-title" required>
                <textarea placeholder="Descrição do passo 1" class="step-description" required></textarea>
            </div>
            <div class="step-input">
                <input type="text" placeholder="Título do passo 2" class="step-title" required>
                <textarea placeholder="Descrição do passo 2" class="step-description" required></textarea>
            </div>
            <div class="step-input">
                <input type="text" placeholder="Título do passo 3" class="step-title" required>
                <textarea placeholder="Descrição do passo 3" class="step-description" required></textarea>
            </div>
        `;
        
        // Recarregar roadmaps
        this.search();
        
        this.showNotification('Sucesso!', this.createForm.dataset.editId ? 'Roadmap atualizado com sucesso!' : 'Roadmap criado com sucesso!', 'success');
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.results.innerHTML = '';
        this.noResults.classList.add('hidden');
    }

    hideLoading() {
        this.loading.classList.add('hidden');
    }

    showNoResults() {
        this.hideLoading();
        this.results.innerHTML = '';
        this.noResults.classList.remove('hidden');
    }
    
    showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${icons[type]}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        this.notificationContainer.appendChild(notification);
        
        // Auto remover após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('removing');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Inicializar aplicação
const app = new StudyMaster();