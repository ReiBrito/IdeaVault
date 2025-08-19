class IdeaVault {
  constructor() {
    this.ideas = JSON.parse(localStorage.getItem('ideas')) || [];
    this.filterText = '';
    this.theme = localStorage.getItem('theme') || 'light';

    this.elements = {
      ideaInput: document.getElementById('idea-input'),
      addBtn: document.getElementById('add-btn'),
      ideasList: document.getElementById('ideas-list'),
      filterInput: document.getElementById('filter-input'),
      themeToggle: document.getElementById('theme-toggle'),
      themeIcon: document.getElementById('theme-icon')
    };

    this.init();
  }

  init() {
    this.setTheme();
    this.renderIdeas();
    this.bindEvents();
  }

  bindEvents() {
    this.elements.addBtn.addEventListener('click', () => this.addIdea());
    this.elements.ideaInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.addIdea();
      }
    });
    this.elements.filterInput.addEventListener('input', (e) => {
      this.filterText = e.target.value.toLowerCase();
      this.renderIdeas();
    });
    this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
  }

  addIdea() {
    const text = this.elements.ideaInput.value.trim();
    if (!text) return;

    const idea = {
      id: Date.now().toString(),
      text,
      date: new Date().toLocaleDateString('pt-BR')
    };

    this.ideas.unshift(idea); // Adiciona no início
    this.saveToStorage();
    this.renderIdeas();

    this.elements.ideaInput.value = '';
    this.elements.ideaInput.focus();
  }

  deleteIdea(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    card.classList.add('removing');

    setTimeout(() => {
      this.ideas = this.ideas.filter(idea => idea.id !== id);
      this.saveToStorage();
      this.renderIdeas();
    }, 300);
  }

  renderIdeas() {
    const filteredIdeas = this.ideas.filter(idea =>
      idea.text.toLowerCase().includes(this.filterText)
    );

    this.elements.ideasList.innerHTML = '';

    if (filteredIdeas.length === 0) {
      const noIdeas = document.createElement('p');
      noIdeas.className = 'no-ideas';
      noIdeas.textContent = this.filterText ? 'Nenhuma ideia encontrada.' : 'Nenhuma ideia ainda. Adicione uma!';
      this.elements.ideasList.appendChild(noIdeas);
      return;
    }

    filteredIdeas.forEach(idea => {
      const card = document.createElement('div');
      card.className = 'idea-card';
      card.setAttribute('data-id', idea.id);

      card.innerHTML = `
        <div class="content">${this.escapeHtml(idea.text)}</div>
        <div class="date">Criado em: ${idea.date}</div>
        <button onclick="app.deleteIdea('${idea.id}')">
          ×
        </button>
      `;

      this.elements.ideasList.appendChild(card);
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  saveToStorage() {
    localStorage.setItem('ideas', JSON.stringify(this.ideas));
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme();
    localStorage.setItem('theme', this.theme);
  }

  setTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.elements.themeIcon.innerHTML = this.theme === 'light' ?
      '<path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-7-7z" />' :
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />';
  }
}

// Inicializa o app
const app = new IdeaVault();