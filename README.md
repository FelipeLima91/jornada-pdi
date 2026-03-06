# Jornada PDI (Plano de Desenvolvimento Individual) 🚀

Bem-vindo ao repositório do **Jornada PDI**, uma aplicação web focada em ajudar profissionais e colaboradores a estruturar, acompanhar e registrar seus Planos de Desenvolvimento Individual de forma simples, interativa e visualmente agradável.

## 🎯 Finalidade do Projeto

O objetivo principal desta aplicação é substituir planilhas e documentos estáticos por uma ferramenta focada e gamificada. Com ela, o usuário pode definir com clareza seus objetivos de carreira, mapear quais habilidades precisam de atenção imediata e traçar um plano de ação tático com prazos definidos.
O grande diferencial é a **experiência do usuário (UX)** focada em edição _inline_ rápida, sem necessidade de navegar entre múltiplas páginas de cadastro, mantendo todo o progresso salvo automaticamente no próprio navegador do usuário (cache local).

## ✨ Principais Funcionalidades

A aplicação é dividida em seções estratégicas, cada uma construída para uma etapa específica do plano de desenvolvimento:

1. **Cabeçalho Principal (Header)**
   - Título fixo "Plano de Desenvolvimento Individual".
   - Subtítulo editável com o **Nome do Colaborador** (clique para editar, enter para salvar).

2. **Objetivo de Carreira ("Onde quero chegar?")**
   - Um cartão de destaque na cor _Amber_, que serve como norte do PDI.
   - Textarea editável com um clique, facilitando atualizações rápidas do planejamento de longo prazo.

3. **Habilidades Fundamentais ("O que preciso focar?")**
   - Dividido em duas colunas complementares:
     - _Já existem e precisam ser potencializadas_ (Pontos fortes a lapidar)
     - _Preciso aprender antes do próximo passo_ (Gaps de conhecimento)
   - Inserção de habilidades no formato de "Tags" coloridas (com tons variados de amarelo/âmbar).
   - Para remover uma habilidade, um botão "X" aparece ao passar o mouse. Essa ação chama um **Modal de Confirmação** e dispara um _Toast_ avisando da exclusão, o qual conta com um botão **"Desfazer"** para evitar perdas acidentais.

4. **Plano de Ação ("Como e quando chegarei lá?")**
   - Tabela de ações com três colunas: _Plano de ação_, _Prazo_ (estimativa de conclusão) e _Como sei que me desenvolvi_ (indicador de sucesso).
   - Linhas totalmente editáveis inline, com ícones de edição e confirmação.
   - A coluna de prazo utiliza um componente avançado de **Calendário (shadcn DatePicker + pt-BR)** para seleção fácil de datas.
   - Remoção protegida pelo mesmo fluxo seguro: Modal de Confirmação + Toast de Sucesso (com botão desfazer).

5. **Anotações Livres**
   - Uma seção no rodapé, escondida por padrão (formato _Accordion_ flexível).
   - Espaço para apontamentos pontuais, links úteis, atas de feedbacks de gestores (1-1), etc.

6. **Persistência de Dados (Auto-Save)**
   - Cada campo, texto ou linha cadastrada na aplicação é **salva em tempo real** no `localStorage` do navegador do usuário.
   - Mesmo ao recarregar a página ou fechar o navegador, nenhum progresso é perdido.

## 🛠 Tecnologias Utilizadas

Este projeto foi construído com ferramentas modernas do ecossistema React, buscando performance, manutenibilidade e design sofisticado:

- **Next.js (App/Pages Router):** Framework principal da aplicação em React.
- **Tailwind CSS:** Para estilização utilitária e responsividade rápida.
- **shadcn/ui (Estilo Lyra):** Componentes base de alta qualidade, customizados com tema sem bordas arredondadas e utilizando uma paleta de cores _amber_ marcante.
- **Lucide React:** Para uma iconografia consistente, moderna e leve ao longo da aplicação.
- **Sonner:** Biblioteca utilizada para os Toasts de notificação flutuantes (muito utilizada na ação de remover e desfazer exclusões).
- **Date-fns & React-Day-Picker:** Motores robustos e flexíveis utilizados por trás do DatePicker e do Calendário customizado no Plano de Ação, devidamente regionalizado (PT-BR).
- **TypeScript:** Para tipagem segura e garantia de menos erros durante o desenvolvimento (especialmente nas tabelas dinâmicas e gerenciamento de estado das linhas).

## 📂 Estrutura de Pastas

A estrutura obedece às melhores práticas de um projeto Next.js com Tailwind e arquivos componentes modulares:

```text
c:\GitHub\jornada-pdi\
├── components/                       # Componentes de negócio (Específicos da Aplicação)
│   ├── Anotacoes.tsx                 # Accordion de anotações livres em texto
│   ├── HabilidadesFundamentais.tsx   # Gerencia as duas colunas de "tags" de habilidades
│   ├── ObjetivoCarreira.tsx          # Card de destaque *amber* editável
│   ├── PlanoDeAcao.tsx               # Tabela dinâmica de ações, prazos e indicadores
│   └── Titulo.tsx                    # Componente isolado para tratamento de título editável
│
├── components/ui/                    # Base do Design System e primitives (Baseados no shadcn)
│   ├── button.tsx                    # Botão padrão base
│   ├── calendar.tsx                  # Componente base do calendário interativo (react-day-picker)
│   ├── date-picker.tsx               # Componente composto unindo Calendar e Popover
│   └── popover.tsx                   # Sistema de float (utilizado no campo de data)
│
├── hooks/                            # Hooks Customizados
│   └── useLocalStorage.ts            # Lógica centralizada para cache SSR-friendly e persistence de dados
│
├── pages/                            # Next.js Pages Routing
│   ├── _app.tsx                      # Configuração root (Importação de Toaster global e do CSS)
│   ├── _document.tsx                 # Base HTML default do projeto web
│   └── index.tsx                     # Página Inicial da aplicação, integrando todos os componentes criados
│
├── public/                           # Arquivos estáticos (imagens, svgs, ícones)
├── styles/                           # Estilização Global
│   └── globals.css                   # Variáveis CSS para a paleta *amber* customizada e resets Tailwind
│
├── components.json                   # Configuração e registro do shadcn/ui
├── next.config.mjs                   # Configurações de compilação do Next.js
├── package.json                      # Dependências (React, Lucide, Sonner) e Scripts de Run
├── tailwind.config.ts                # Configuração do Tailwind com base no design do css do shadcn/ui
└── tsconfig.json                     # Regras e configurações de mapeamento do TypeScript (ex: alias @/)
```

## 🚀 Como Rodar o Projeto

1. Certifique-se de ter o **Node.js** e o **NPM** instalados.
2. Clone este repositório para sua máquina local.
3. No terminal (dentro da pasta do projeto), rode `npm install` para instalar as dependências, que incluem todos os hardwares necessários: React Day Picker, Date FNS, Sonner e Tailwind.
4. Execute `npm run dev` para subir o ambiente local de desenvolvimento.
5. Acesse `http://localhost:3000` no seu browser. Use e teste o preenchimento, as listagens e comprove a persistência após o _F5_ da tela!

---

_A Jornada começa aqui. Foque em agir e crescer!_
