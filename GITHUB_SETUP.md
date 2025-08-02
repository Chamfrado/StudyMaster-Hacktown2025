# 🚀 Como subir para o GitHub

## Passos para criar o repositório StudyMaster-Hacktown2025:

### 1. Criar repositório no GitHub
1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome: `StudyMaster-Hacktown2025`
4. Descrição: `🎯 Portal de Roadmaps de Programação criado no Hacktown 2025 com Amazon Q Developer CLI`
5. Marque como **Public**
6. **NÃO** inicialize com README (já temos um)
7. Clique em "Create repository"

### 2. Conectar repositório local ao GitHub
Execute estes comandos no terminal (substitua SEU_USUARIO pelo seu username do GitHub):

```bash
# Adicionar remote origin
git remote add origin https://github.com/SEU_USUARIO/StudyMaster-Hacktown2025.git

# Renomear branch para main (padrão atual do GitHub)
git branch -M main

# Push inicial
git push -u origin main
```

### 3. Configurar GitHub Pages (opcional)
1. Vá em Settings > Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: /frontend
5. Save

Seu projeto estará disponível em: `https://SEU_USUARIO.github.io/StudyMaster-Hacktown2025/`

## 🎯 Exemplo de URL final:
- **Repositório**: `https://github.com/SEU_USUARIO/StudyMaster-Hacktown2025`
- **GitHub Pages**: `https://SEU_USUARIO.github.io/StudyMaster-Hacktown2025/`

## 📝 Comandos já executados:
✅ `git init`
✅ `git add .`
✅ `git commit -m "..."`

## 🏆 Próximos passos após o push:
1. Adicionar topics no GitHub: `hacktown2025`, `amazon-q-developer`, `serverless`, `aws`, `roadmaps`
2. Criar uma release v1.0.0
3. Adicionar screenshot do projeto no README
4. Compartilhar nas redes sociais com #Hacktown2025