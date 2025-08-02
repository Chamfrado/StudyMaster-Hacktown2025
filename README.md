# 🎯 StudyMaster - Portal de Roadmaps de Programação

> **Criado durante o Hacktown 2025 usando Amazon Q Developer CLI** 🚀

Portal serverless completo para pesquisar, visualizar e **criar** roadmaps de estudos em programação. Uma plataforma colaborativa onde desenvolvedores podem encontrar trilhas de aprendizado e contribuir com seus próprios roadmaps.

## 🏆 Hacktown 2025 - Powered by Amazon Q Developer

Este projeto foi desenvolvido inteiramente durante o **Hacktown 2025** utilizando o **Amazon Q Developer CLI** como assistente de desenvolvimento. Demonstra como IA pode acelerar o desenvolvimento de aplicações serverless completas.

### 🤖 Tecnologias Amazon Q Developer utilizadas:
- Geração de código automatizada
- Arquitetura serverless otimizada
- Boas práticas de desenvolvimento
- Interface moderna e responsiva
- Integração completa AWS

## 🚀 Arquitetura Serverless

- **Frontend**: HTML/CSS/JS hospedado no S3 + CloudFront
- **Backend**: AWS Lambda + API Gateway
- **Banco**: DynamoDB com GSI
- **Deploy**: AWS SAM (Infrastructure as Code)
- **Storage**: LocalStorage para roadmaps de usuários

## 📁 Estrutura do Projeto

```
StudyMaster/
├── backend/                 # Funções Lambda
│   ├── search_roadmaps.py  # Buscar roadmaps
│   ├── get_roadmap.py      # Obter roadmap específico
│   └── requirements.txt    # Dependências Python
├── frontend/               # Interface web
│   ├── index.html         # Página principal
│   ├── style.css          # Estilos
│   └── script.js          # Funcionalidades JS
├── scripts/               # Scripts utilitários
│   └── populate_db.py     # Popular banco com dados
├── template.yaml          # Template SAM
└── README.md
```

## 🛠️ Como Executar

### Pré-requisitos
- AWS CLI configurado
- SAM CLI instalado
- Python 3.9+

### 1. Deploy da Infraestrutura
```bash
sam build
sam deploy --guided
```

### 2. Popular o Banco
```bash
cd scripts
python populate_db.py
```

### 3. Atualizar URL da API
Após o deploy, atualize a variável `API_BASE_URL` no arquivo `frontend/script.js` com a URL real da API.

### 4. Deploy do Frontend
```bash
aws s3 sync frontend/ s3://studymaster-frontend-{ACCOUNT_ID}/
```

## 🎯 Funcionalidades Completas

### 🔍 **Sistema de Busca Avançado**
- ✅ Busca por texto livre (título, tópico, descrição)
- ✅ Filtro por dificuldade (Iniciante/Intermediário/Avançado)
- ✅ Filtro por categoria (Web, Mobile, Backend, DevOps, etc.)
- ✅ Combinação de múltiplos filtros
- ✅ Botão "Limpar Filtros"

### 📚 **42+ Roadmaps Profissionais**
- ✅ Roadmaps curados pela equipe StudyMaster
- ✅ Cobertura completa de tecnologias modernas
- ✅ Passos detalhados de aprendizado
- ✅ Níveis de dificuldade bem definidos

### 👥 **Sistema de Contribuição Comunitária**
- ✅ Criação de roadmaps por usuários
- ✅ Formulário completo e validado
- ✅ Sistema de autoria (StudyMaster vs. Comunidade)
- ✅ Armazenamento local persistente
- ✅ Integração total com busca e filtros

### 🎨 **Interface Moderna**
- ✅ Design responsivo (mobile-first)
- ✅ Modais interativos
- ✅ Animações suaves
- ✅ UX intuitiva
- ✅ Tema gradiente moderno

### ⚡ **Performance & Escalabilidade**
- ✅ Arquitetura 100% serverless
- ✅ Baixo custo operacional
- ✅ Escalabilidade automática
- ✅ CDN global (CloudFront)
- ✅ Caching inteligente

## 🔍 Categorias e Roadmaps Disponíveis

### 🌐 **Desenvolvimento Web**
- JavaScript Moderno, React, Vue.js, Angular
- Node.js, GraphQL, Blockchain Development

### 📱 **Mobile Development**
- Flutter, React Native, iOS (Swift), Android (Kotlin)

### ⚙️ **Backend & Databases**
- Java Spring Boot, C# .NET, Go, Rust
- MongoDB, PostgreSQL, Redis, Elasticsearch

### 🚀 **DevOps & Cloud**
- Docker, Kubernetes, AWS DevOps, Terraform
- Ansible, Jenkins, GitHub Actions, Cloud Architecture

### 🤖 **Data Science & AI**
- Python Data Science, Machine Learning, Data Engineering

### 🎮 **Game Development**
- Unity, Unreal Engine, Godot

### 🎨 **Design & Criatividade**
- Figma, UI/UX Design, Blender 3D, After Effects

### 💼 **Negócios & Gestão**
- Product Management, Scrum Master, Digital Marketing

### 🔒 **Segurança**
- Cybersecurity, Algoritmos e Estruturas de Dados

## 🚀 Como Executar Localmente

### Desenvolvimento Frontend (Imediato)
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/StudyMaster-Hacktown2025.git
cd StudyMaster-Hacktown2025

# Abra o frontend diretamente no navegador
open frontend/index.html
# ou
python -m http.server 8000 -d frontend
```

### Deploy Completo AWS
```bash
# Pré-requisitos: AWS CLI + SAM CLI configurados

# 1. Build e Deploy da infraestrutura
sam build
sam deploy --guided

# 2. Popular banco de dados
cd scripts
python populate_db.py

# 3. Atualizar URL da API no frontend
# Edite frontend/script.js com a URL real da API

# 4. Deploy do frontend
aws s3 sync frontend/ s3://studymaster-frontend-{ACCOUNT_ID}/
```

## 💡 Roadmap Futuro

- [ ] Sistema de autenticação (AWS Cognito)
- [ ] Favoritos e progresso de estudos
- [ ] Sistema de avaliações e comentários
- [ ] Integração com APIs de cursos (Udemy, Coursera)
- [ ] Notificações push para lembretes de estudo
- [ ] Dashboard analytics para criadores
- [ ] Sistema de badges e gamificação
- [ ] Export de roadmaps para PDF
- [ ] API pública para desenvolvedores
- [ ] Integração com GitHub para tracking de projetos

## 🏆 Hacktown 2025 - Destaques Técnicos

### 🤖 **Desenvolvido com Amazon Q Developer**
- **100% do código** gerado com assistência de IA
- **Arquitetura serverless** otimizada automaticamente
- **Boas práticas** aplicadas desde o início
- **Debugging** e otimização assistida por IA

### 🚀 **Resultados Impressionantes**
- **42+ roadmaps** profissionais incluídos
- **Sistema completo** em tempo recorde
- **Interface moderna** e responsiva
- **Funcionalidades avançadas** (filtros, criação, etc.)
- **Arquitetura escalável** pronta para produção

### 💰 **Custo-Benefício**
- **Infraestrutura serverless** = custos mínimos
- **Pay-per-use** = escala conforme demanda
- **S3 + CloudFront** = entrega global rápida
- **DynamoDB** = performance consistente

## 🤝 Contribuindo

Este projeto foi criado durante o Hacktown 2025 como demonstração das capacidades do Amazon Q Developer. Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- **Hacktown 2025** pela oportunidade incrível
- **Amazon Q Developer** pela assistência excepcional no desenvolvimento
- **AWS** pela infraestrutura serverless robusta
- **Comunidade de desenvolvedores** que inspirou os roadmaps

---

**Feito com ❤️ durante o Hacktown 2025 usando Amazon Q Developer CLI**