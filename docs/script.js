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
            alert('Usuário ou senha incorretos!');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        
        if (this.users.find(u => u.username === username)) {
            alert('Usuário já existe!');
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
        
        alert('Cadastro realizado com sucesso!');
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
            alert('Faça login para favoritar roadmaps!');
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
            alert('Faça login para marcar roadmaps como concluídos!');
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
            alert('Faça login para criar roadmaps!');
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
            {id: '5', title: 'DevOps com AWS', topic: 'devops', category: 'devops', author: 'StudyMaster', description: 'Aprenda práticas DevOps usando serviços AWS.', difficulty: 'Avançado', steps: [{title: 'AWS Basics', description: 'EC2, S3, IAM fundamentals'}, {title: 'Docker', description: 'Containerização de aplicações'}, {title: 'CI/CD', description: 'CodePipeline, CodeBuild, CodeDeploy'}, {title: 'Infrastructure as Code', description: 'CloudFormation e Terraform'}, {title: 'Monitoring', description: 'CloudWatch, X-Ray, logging'}]}
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
            alert('Por favor, adicione pelo menos 3 passos ao roadmap.');
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
        
        alert(this.createForm.dataset.editId ? 'Roadmap atualizado com sucesso!' : 'Roadmap criado com sucesso!');
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
}

// Inicializar aplicação
const app = new StudyMaster();