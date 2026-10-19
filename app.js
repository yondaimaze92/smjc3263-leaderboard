/* SMJC 3263 Separation Process 1 — Gamified Leaderboard: state, logic and rendering */
(() => {
  'use strict';

  // ---------- SVG Icon System ----------
  const ICONS = {
    'flask': '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>',
    'academic-cap': '<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>',
    'shield': '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>',
    'eye': '<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>',
    'eye-off': '<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>',
    'book-open': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>',
    'book': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>',
    'key': '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"/>',
    'calendar': '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>',
    'pencil': '<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/>',
    'chart-bar': '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>',
    'cloud': '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"/>',
    'cog': '<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>',
    'trophy': '<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"/>',
    'users': '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>',
    'plus': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>',
    'sparkles': '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/>',
    'arrow-down': '<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>',
    'clipboard': '<path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"/>',
    'inbox': '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"/>',
    'scroll': '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>',
    'x': '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>',
    'check': '<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>',
    'check-circle': '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    'target': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0a9 9 0 000-18 9 9 0 000 18zm0-4.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0 0a4.5 4.5 0 000-9 4.5 4.5 0 000 9z"/>',
    'medal': '<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"/>',
    'chart-line': '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/>',
    'party': '<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>',
    'bolt': '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>',
    'pencil-square': '<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>',
    'building': '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"/>',
    'spray': '<path stroke-linecap="round" stroke-linejoin="round" d="M7.5 17.25h9m-9 0a2.25 2.25 0 01-2.25-2.25M16.5 17.25a2.25 2.25 0 002.25-2.25M7.5 15h9m-9 0a2.25 2.25 0 01-2.25-2.25M16.5 15a2.25 2.25 0 002.25-2.25M7.5 12.75h9m-9 0a2.25 2.25 0 01-2.25-2.25M16.5 12.75a2.25 2.25 0 002.25-2.25M7.5 10.5h9m-9 0a2.25 2.25 0 01-2.25-2.25M16.5 10.5a2.25 2.25 0 002.25-2.25M7.5 8.25h9m-9 0a2.25 2.25 0 01-2.25-2.25M16.5 8.25a2.25 2.25 0 002.25-2.25"/>',
    'user': '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>',
    'warning': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>',
    'refresh': '<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>',
    'trash': '<path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>',
    'download': '<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>',
    'logout': '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/>',
    'compass': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0a9 9 0 000-18 9 9 0 000 18zm0-4.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0 0a4.5 4.5 0 000-9 4.5 4.5 0 000 9z"/>',
    'trending-up': '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/>',
    'handshake': '<path stroke-linecap="round" stroke-linejoin="round" d="M11 17.25h9m-9 0a2.25 2.25 0 01-2.25-2.25M16.5 17.25a2.25 2.25 0 002.25-2.25M7.5 15h9m-9 0a2.25 2.25 0 01-2.25-2.25M16.5 15a2.25 2.25 0 002.25-2.25M7.5 12.75h9m-9 0a2.25 2.25 0 01-2.25-2.25M16.5 12.75a2.25 2.25 0 002.25-2.25M7.5 10.5h9m-9 0a2.25 2.25 0 01-2.25-2.25M16.5 10.5a2.25 2.25 0 002.25-2.25M7.5 8.25h9m-9 0a2.25 2.25 0 01-2.25-2.25M16.5 8.25a2.25 2.25 0 002.25-2.25"/>',
    'arrow-path': '<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>',
    'wind': '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 7.5l16.5-4.125m0 13.5L3.75 16.875m16.5-4.125c0 2.25-1.5 3-3.75 3s-3.75-.75-3.75-3 1.5-3 3.75-3 3.75.75 3.75 3zm-16.5 0c0 2.25-1.5 3-3.75 3S0 11.625 0 9.375 1.5 6.375 3.75 6.375 7.5 7.125 7.5 9.375z"/>',
    'tower': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18m-6-18h12M8 21h8M9 7.5h6M10 12h4M10.5 16.5h3"/>',
    'leaf': '<path stroke-linecap="round" stroke-linejoin="round" d="M5 21c0-4.5 2.5-9 7-11m7 11c0-4.5-2.5-9-7-11m0 0C7.5 12 5 16.5 5 21m7-11c2.5 2 5 6.5 5 11m-5-11V3m0 0c-2 0-4 1-5 3m5-3c2 0 4 1 5 3"/>',
    'hard-hat': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v3m0 0c-4.5 0-8 2-8 5v3h16v-3c0-3-3.5-5-8-5zm-8 8h16v3H4v-3zm2 3v6h12v-6"/>',
    'briefcase': '<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"/>',
    'beaker': '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>',
    'gear': '<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>',
    'test-tube': '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>',
    'microscope': '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18h8m-6-4h4m-2-4h2m-1-4h2m-5 12h10a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2z"/>',
    'factory': '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"/>',
    'thermometer': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v10.5m0 0a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm0 0V3m0 0a2.25 2.25 0 00-2.25 2.25M12 3a2.25 2.25 0 012.25 2.25"/>',
    'droplet': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3c-4.5 4.5-7 8-7 11a7 7 0 0014 0c0-3-2.5-6.5-7-11z"/>',
    'fire': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3c1.5 2 4 4.5 4 8a4 4 0 01-8 0c0-1.5.5-2.5 1-3.5.5 1 1 1.5 2 1.5-.5-2 0-4 1-6z"/>',
    'snowflake': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18m-9-9h18M5.5 5.5l13 13m0-13l-13 13"/>',
    'magnet': '<path stroke-linecap="round" stroke-linejoin="round" d="M6 3v8a6 6 0 0012 0V3M6 3h4v4H6V3zm8 0h4v4h-4V3zM6 15h4v4H6v-4zm8 0h4v4h-4v-4z"/>',
    'owl': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3c-3 0-5 2-5 5v4c0 3 2 5 5 5s5-2 5-5V8c0-3-2-5-5-5zm-3 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm6 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM9 16l-1 3m4-3l1 3m-4 0h4"/>',
    'panda': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3c-4 0-7 2.5-7 6v3c0 3.5 3 6 7 6s7-2.5 7-6V9c0-3.5-3-6-7-6zM8 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm8 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM9 15h6m-5 2l-1 2m4-2l1 2"/>',
    'fox': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3L4 8v8l8 5 8-5V8l-8-5zm0 0v18m-8-13l8 5 8-5M8 12h.01M16 12h.01M10 16c.5.5 1.5 1 2 1s1.5-.5 2-1"/>',
    'tiger': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3c-4 0-7 2.5-7 6v3c0 3.5 3 6 7 6s7-2.5 7-6V9c0-3.5-3-6-7-6zM8 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm8 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM9 15h6m-5 2l-1 2m4-2l1 2M7 5L5 3m12 2l2-2"/>',
    'rocket': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 15c5-3 7-8 7-12-4 0-9 2-12 7l-3 1 4 4 1-3c1 1 2 2 3 3zm-3 3l-4 4m4-4l-2 5m2-5l5-2m-5 2l-1-4m1 4l4-1"/>',
    'graduation': '<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>',
    'lifebuoy': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0a9 9 0 000-18 9 9 0 000 18zm0-4.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0 0a4.5 4.5 0 000-9 4.5 4.5 0 000 9z"/>',
    'wrench': '<path stroke-linecap="round" stroke-linejoin="round" d="M14.7 6.3a4.5 4.5 0 00-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 006-6L14 13l-3-3 3.7-3.7z"/>',
  };
  // ---------- Config ----------
  const COURSE = { code: 'SMJC 3263', name: 'Separation Process 1', session: '2026/2027-I',
    lecturer: 'AP Ir Ts Dr Mariam Firdhaus Md Nordin' };
  const PM_TASK_REQ = 90; // Plant Manager also needs Task Completion ≥ 90%
  const GOALS = { attendance: 80, tasks: 80 };

  // Career ladder follows the course's unit-operation sequence
  const ROLES = [
    { name: 'Separation Intern', icon: 'vest', min: 0, desc: 'Types of separation processes' },
    { name: 'Humidification Operator', icon: 'wind', min: 300, desc: 'Continuous humidification' },
    { name: 'Absorption Tower Technician', icon: 'tower', min: 450, desc: 'Plate & packed tower absorption' },
    { name: 'Leaching Specialist', icon: 'leaf', min: 600, desc: 'Single & counter-current multistage leaching' },
    { name: 'Head of Process Engineer', icon: 'hard-hat', min: 750, desc: 'VLE & McCabe-Thiele distillation' },
    { name: 'Plant Manager', icon: 'briefcase', min: 900, desc: `Liquid-liquid extraction mastery · needs ≥${PM_TASK_REQ}% tasks` },
  ];

  // XP activities mapped to the course's T&L methods (Lecture/Discussion, Active learning, PBL)
  const ACTIVITIES = [
    { id: 'al', name: 'In-class Active-Learning Activity', xp: 30, badge: 'zap Active Learner' },
    { id: 'quiz', name: 'Quiz / Assignment Submitted', xp: 40, badge: 'edit Quiz Finisher' },
    { id: 'tut', name: 'Tutorial Problem Solved on Whiteboard', xp: 50, badge: 'ruler Whiteboard Solver' },
    { id: 'proj', name: 'Project Progress Presentation (PBL)', xp: 75, badge: 'hard-hat Project Presenter' },
    { id: 'peer', name: 'Teamwork / Peer Mentorship (CLO4)', xp: 30, badge: 'handshake Team Player' },
  ];

  const WEEKS = [
    { w: 1, t: 'Introduction; Types of Separation Processes', clo: [1] },
    { w: 2, t: 'Continuous Humidification Processes', clo: [1, 2, 3] },
    { w: 3, t: 'Absorption in Plate and Packed Towers', clo: [1, 2, 3] },
    { w: 4, t: 'Absorption of Concentrated Mixtures', clo: [2, 3] },
    { w: 5, t: 'Mass Transfer Coefficients for Packed Towers', clo: [2, 3] },
    { w: 6, t: 'Leaching Equipment & Single-Stage Leaching', clo: [1] },
    { w: 7, t: 'Counter-Current Multistage Leaching', clo: [2, 3] },
    { w: 8, t: 'Vapour-Liquid Equilibrium Relation', clo: [1, 2] },
    { w: 9, t: 'Single-Stage Equilibrium Contact (VLE)', clo: [1, 2] },
    { w: 10, t: 'Simple Distillation Methods', clo: [2, 3] },
    { w: 11, t: 'Binary Fractional Distillation (McCabe-Thiele)', clo: [2, 3] },
    { w: 12, t: 'Single-Stage Liquid-Liquid Extraction', clo: [2, 3] },
    { w: 13, t: 'Equipment for Liquid-Liquid Extraction', clo: [1] },
    { w: 14, t: 'Project Presentations and Revisions', clo: [4, 5] },
  ];

  // Unit-operation badges: earned when every week of that unit is completed
  const UNITS = [
    { id: 'hum', name: 'Humidification', badge: 'wind Humidity Handler', weeks: [2] },
    { id: 'abs', name: 'Absorption', badge: 'tower Tower Tamer', weeks: [3, 4, 5] },
    { id: 'lea', name: 'Leaching', badge: 'leaf Leaching Lead', weeks: [6, 7] },
    { id: 'dis', name: 'VLE & Distillation', badge: 'ruler McCabe-Thiele Master', weeks: [8, 9, 10, 11] },
    { id: 'lle', name: 'Liquid-Liquid Extraction', badge: 'flask-round Extraction Expert', weeks: [12, 13] },
  ];

  // Official assessment weightings (Section 6 of the course information)
  const ASSESS = [
    { id: 'quiz', name: 'Quiz / Assignment', w: 20 },
    { id: 't1', name: 'Test 1', w: 20 },
    { id: 'proj', name: 'Project', w: 20 },
    { id: 'final', name: 'Final Examination', w: 40 },
  ];

  const AVATARS = ['vest','gear','test-tube','microscope','hard-hat','briefcase','flask','petri-dish','oil-drum','factory','thermometer','droplet','fire','ice','magnet','owl','panda','fox','tiger','rocket'];

const STUDENT_NAMES = [
  'AAINAA AAQILAH BINTI MOHAMAD YUSOF','DZILHAMADIL AKHYAR BIN HAMRAN',
  'HANAN NABIL MOHAMMED ABDO ALABSI','MUQRI NAUFAL BIN MOHD NAJIB',
  'NASHVIN A/L MANIARASAN','NURUL AIDA BATRISYIA BINTI ROSLI',
  'TEHSIGAN A/L SARAVANAN','YASHWINI A/P VIJENTHRAN',
  'ALISSA BINTI REDUAN CHIN','AMMAR ARSYAD BIN MD.MOHTAR',
  'ARTHUR LO WEI HAO','CHIEW XIN RONG','HAU LEE MIN',
  'IRINA SYUHADA BINTI FADIL','MUHAMMAD ARIFF HUSNI BIN ABDUL RAZAK',
  'NEHAVATHI A/P VALLMURUGAN','NOR ALYA FARISHA BINTI LATIF','PEK JIE MIN',
  'PUTERI AINA MAISYARAH BINTI SULAIMAN','PUTRI NUR AFIQAH AUNI BINTI NUR MIZHUARI',
  'SITI NUR AMALINA BINTI AZHARI','TAN SEE JIE',
  'VIVIANA ARLIN ANAK VINCENT','IZZAT BIN MAZLAN'
];

  // ---------- Seed dataset (N = 24) ----------
  const lerp = (a, b, t) => Math.round(a + (b - a) * t);
  const pad = n => String(n).padStart(2, '0');
  function seed() {
    const s = [];
    const top = [960, 925, 880, 850, 820];
    top.forEach((xp, i) => s.push({
      id: i + 1, tier: 'Top', pseudo: `Participant_Top_${pad(i + 1)}`, xp,
      att: [98, 96, 95, 93, 92][i], task: [97, 95, 92, 90, 88][i], mid: [88, 86, 84, 82, 80][i],
    }));
    for (let i = 0; i < 15; i++) {
      const t = i / 14, n = i + 6;
      s.push({
        id: n, tier: 'Mid', pseudo: `Participant_Mid_${pad(n)}`,
        xp: i === 7 ? s[s.length - 1].xp : lerp(740, 320, t), // deliberate XP tie to showcase tie-breaking
        att: lerp(88, 65, t) + (i % 3 === 0 ? 1 : 0), task: lerp(80, 48, t) - (i % 4 === 1 ? 2 : 0), mid: lerp(77, 50, t),
      });
    }
    for (let i = 0; i < 4; i++) {
      const t = i / 4, n = i + 21;
      s.push({
        id: n, tier: 'Low', pseudo: `Participant_Low_${pad(n)}`,
        xp: lerp(280, 110, t), att: lerp(62, 50, t), task: lerp(45, 25, t), mid: lerp(48, 35, t),
      });
    }
    s.forEach((st, i) => {
      st.avatar = AVATARS[(i * 7) % AVATARS.length];
      st.realName = STUDENT_NAMES[i] || null;
      st.showReal = !!STUDENT_NAMES[i];
      // seed some prior activity history for badges
      st.acts = {};
      ACTIVITIES.forEach((a, j) => { if ((st.id + j) % (st.tier === 'Top' ? 2 : st.tier === 'Mid' ? 3 : 5) === 0) st.acts[a.id] = 1; });
      st.weeks = [1];
      st.marks = { quiz: Math.min(100, st.mid + 5), t1: st.mid, proj: null, final: null };
    });
    return s;
  }

  // ---------- State & Firebase Firestore Integration ----------
  const firebaseConfig = {
    apiKey: "AIzaSyAKHHzWtUu_AcKttp0RmIAgkSkO6NlFNyQ",
    authDomain: "smjc3263.firebaseapp.com",
    projectId: "smjc3263",
    storageBucket: "smjc3263.firebasestorage.app",
    messagingSenderId: "917322283917",
    appId: "1:917322283917:web:cb0729e3d23a06bdb79bc4",
    measurementId: "G-7268PHL9RT"
  };

  let db = null;
  let isFirestoreOnline = false;
  try {
    if (window.firebase) {
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
    }
  } catch (err) {
    console.warn('Firebase init warning:', err);
  }

  const STORE_KEY = 'smjc3263_state_v1';
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
  const legacy = JSON.parse(localStorage.getItem('smjc3283_state_v1') || 'null'); // keep issued logins
  const state = saved || {
    students: seed(), meId: 12, mode: 'absolute', search: '', role: '',
    creds: legacy?.creds, adminPw: legacy?.adminPw,
    stream: [
      { msg: `Semester ${COURSE.session} leaderboard initialised for ${COURSE.code} ${COURSE.name} (N = 24).`, ts: Date.now() - 3600e3, promo: false },
    ],
  };
  function enforceRoster() {
    if (!Array.isArray(state.students)) return false;
    const before = state.students.length;
    state.students = state.students.filter(s => s.id >= 1 && s.id <= STUDENT_NAMES.length);
    let changed = state.students.length !== before;
    if (state.creds) Object.keys(state.creds).forEach(k => {
      if (+k < 1 || +k > STUDENT_NAMES.length) { delete state.creds[k]; changed = true; }
    });
    if (state.meId < 1 || state.meId > STUDENT_NAMES.length) { state.meId = 1; changed = true; }
    return changed;
  }
  enforceRoster();

  function updateCloudStatus(status, text) {
    const el = document.getElementById('cloud-status');
    if (!el) return;
    el.className = 'cloud-status ' + (status || '');
    el.innerHTML = text;
  }

  let isApplyingRemoteUpdate = false;
  let cloudReady = false; // don't write to cloud until we've loaded the cloud copy first
  let saveTimer = null;
  const persist = (syncCloud = true) => {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    if (db && syncCloud && cloudReady && !isApplyingRemoteUpdate) {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(async () => {
        try {
          updateCloudStatus('online', `${icon('cloud')} Synced`);
          await db.collection('leaderboard').doc('main_state').set({
            students: state.students,
            creds: state.creds,
            adminPw: state.adminPw,
            stream: state.stream,
            updatedAt: Date.now()
          });
          updateCloudStatus('online', `${icon('cloud')} Synced`);
        } catch (e) {
          console.warn('Firestore write error:', e);
          updateCloudStatus('offline', `${icon('cloud')} Offline`);
        }
      }, 500);
    }
  };

  function initFirestoreSync() {
    if (!db) {
      updateCloudStatus('offline', `${icon('cloud')} Offline`);
      return;
    }
    updateCloudStatus('', `${icon('cloud')} Syncing...`);
    db.collection('leaderboard').doc('main_state').onSnapshot((doc) => {
      if (doc.exists) {
        const cloudData = doc.data();
        let changed = false;
        let restoreCloud = false;
        const isEmpty = v => v == null || v === '' ||
          (Array.isArray(v) ? v.length === 0 : typeof v === 'object' && Object.keys(v).length === 0);
        // For every saved field: cloud wins when it has data; an empty/missing cloud field never
        // wipes local data. Instead, this browser pushes its copy back to the cloud.
        ['students', 'creds', 'adminPw', 'stream'].forEach(key => {
          const cloudVal = cloudData[key];
          if (key === 'students' && cloudVal != null && !Array.isArray(cloudVal)) return;
          if (!isEmpty(cloudVal)) {
            if (JSON.stringify(state[key]) !== JSON.stringify(cloudVal)) {
              state[key] = cloudVal;
              changed = true;
            }
          } else if (!isEmpty(state[key]) && !cloudReady) {
            restoreCloud = true;
          }
        });
        state.students.forEach(prepareStudent);
        // The cloud copy may predate a roster change; never restore removed participants.
        if (enforceRoster()) restoreCloud = true;
        localStorage.setItem(STORE_KEY, JSON.stringify(state));
        updateCloudStatus('online', `${icon('cloud')} Synced`);
        cloudReady = true;
        if (changed) {
          isApplyingRemoteUpdate = true;
          render(false);
          isApplyingRemoteUpdate = false;
        }
        if (restoreCloud) persist(true);
      } else {
        cloudReady = true;
        persist(true);
      }
    }, (err) => {
      console.warn('Firestore listener error:', err);
      updateCloudStatus('offline', `${icon('cloud')} Offline`);
    });
  }

  state.creds = state.creds || {};          // { [studentId]: { uid, pw } }
  state.adminPw = state.adminPw || 'admin123';
  state.students.forEach(prepareStudent);

  // Attendance is stored per class session: 14 weeks × 2 sessions = 28 ticks.
  // Existing percentage-only data is converted once so established records are retained.
  function prepareStudent(s) {
    s.weeks = s.weeks || [];
    s.marks = s.marks || {};
    if (!Array.isArray(s.attendance) || s.attendance.length !== 28) {
      const attended = Math.max(0, Math.min(28, Math.round((Number(s.att) || 0) * 28 / 100)));
      s.attendance = Array.from({ length: 28 }, (_, i) => i < attended);
    }
    s.att = Math.round(s.attendance.filter(Boolean).length / 28 * 1000) / 10;
    if (!s.realName) {
      s.realName = STUDENT_NAMES[s.id - 1] || null;
      s.showReal = !!s.realName;
    }
  }

  // ---------- Logic ----------
  function roleIndex(st) {
    let idx = 0;
    ROLES.forEach((r, i) => { if (st.xp >= r.min) idx = i; });
    if (idx === 5 && st.task < PM_TASK_REQ) idx = 4;
    return idx;
  }
  function badgesOf(st) {
    const b = [];
    if (st.att >= 90) b.push('calendar Perfect Presence');
    if (st.task >= 85) b.push('check Task Master');
    const tests = [st.marks.t1].filter(v => v != null);
    if (tests.length && tests.reduce((a, v) => a + v, 0) / tests.length >= 80) b.push('target Test Ace');
    ACTIVITIES.forEach(a => { if (st.acts[a.id]) b.push(a.badge + (st.acts[a.id] > 1 ? ` ×${st.acts[a.id]}` : '')); });
    UNITS.forEach(u => { if (u.weeks.every(w => st.weeks.includes(w))) b.push(u.badge); });
    return b;
  }
  const fmt = v => String(Math.round(v * 10) / 10);
  const carryMark = st => ASSESS.slice(0, 4).reduce((a, x) => a + (st.marks[x.id] != null ? x.w * st.marks[x.id] / 100 : 0), 0);
  const totalMark = st => ASSESS.reduce((a, x) => a + (st.marks[x.id] != null ? x.w * st.marks[x.id] / 100 : 0), 0);
  const GRADES = [[90, 'A+'], [80, 'A'], [75, 'A-'], [70, 'B+'], [65, 'B'], [60, 'B-'], [55, 'C+'], [50, 'C'], [45, 'C-'], [40, 'D+'], [35, 'D'], [30, 'D-'], [0, 'E']];
  const grade = t => GRADES.find(([min]) => t >= min)[1];
  function ranked() {
    const sorted = [...state.students].sort((a, b) => b.xp - a.xp || b.task - a.task || b.att - a.att || a.id - b.id);
    let rank = 0, prev = null;
    return sorted.map((st, i) => {
      if (i === 0 || st.xp !== prev.xp || st.att !== prev.att) {
        rank = i + 1;
      }
      prev = st;
      return { ...st, rank, ri: roleIndex(st) };
    });
  }
  const me = () => state.students.find(s => s.id === state.meId);
  // Display name: each participant chooses whether to show their real name or pseudonym
  const dn = s => (s.showReal && s.realName) ? s.realName : s.pseudo;

  // ---------- Helpers ----------
  const icon = (name, fill = false) => `<svg class="icon${fill ? ' fill' : ''}"><use href="#i-${name}"/></svg>`;
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const timeAgo = ts => {
    const d = Math.floor((Date.now() - ts) / 1000);
    if (d < 60) return 'just now';
    if (d < 3600) return `${Math.floor(d / 60)} min ago`;
    if (d < 86400) return `${Math.floor(d / 3600)} h ago`;
    return `${Math.floor(d / 86400)} d ago`;
  };
  function toast(msg, promo = false) {
    const el = document.createElement('div');
    el.className = 'toast' + (promo ? ' promo' : '');
    el.innerHTML = msg;
    $('#toasts').appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, promo ? 5000 : 3200);
  }
  let flashId = null;

  // ---------- Render ----------
  function renderHub(list) {
    const m = list.find(s => s.id === state.meId);
    const r = ROLES[m.ri];
    $('#btn-avatar').innerHTML = icon(m.avatar, true);
    $('#my-pseudo').textContent = dn(m);
    $('#toggle-real').checked = !!(m.showReal && m.realName);
    $('#real-hint').textContent = m.showReal && m.realName
      ? 'Showing your real name'
      : `Showing pseudonym · ${m.pseudo}`;
    $('#my-role').className = `role-chip r${m.ri}`;
    $('#my-role').innerHTML = `${icon(r.icon, true)} <span>${r.name}</span>`;
    $('#my-rank').textContent = `#${m.rank}`;
    $('#my-xp').textContent = `${m.xp} XP`;

    let pct, next;
    if (m.ri < 5) {
      const nx = ROLES[m.ri + 1];
      const lo = r.min, hi = nx.min;
      if (m.xp >= hi) { // eligible by XP but blocked by task gate
        pct = 100; next = `Raise tasks to ${PM_TASK_REQ}% to become ${icon(nx.icon, true)} ${nx.name}`;
      } else {
        pct = ((m.xp - lo) / (hi - lo)) * 100;
        next = `${hi - m.xp} XP to ${icon(nx.icon, true)} ${nx.name}`;
      }
    } else { pct = 100; next = `${icon('medal')} Top tier reached`; }
    $('#progress-fill').style.width = `${Math.max(3, Math.min(100, pct))}%`;
    $('#next-tier').innerHTML = next;

    const metric = (lbl, v, goal) => `<div class="lbl">${lbl}</div><div class="val">${v}%</div>` +
      (goal != null ? `<div class="goal ${v >= goal ? 'ok' : 'no'}">${v >= goal ? icon('check') + ' Goal' : 'Goal'} ≥${goal}%</div>` : `<div class="goal">Assessment</div>`);
    $('#m-att').innerHTML = metric('Attendance', m.att, GOALS.attendance);
    $('#m-task').innerHTML = metric('Tasks Done', m.task, GOALS.tasks);
    $('#m-mid').innerHTML = `<div class="lbl">Carry Mark</div><div class="val">${fmt(carryMark(m))}<small>/60</small></div><div class="goal">Coursework</div>`;

    $('#my-marks').innerHTML = ASSESS.map(a => {
      const v = m.marks[a.id];
      return `<div class="mk ${v == null ? 'pending' : ''}"><div class="mk-n">${a.name}</div>
        <div class="mk-v mono">${v == null ? '—' : v + '%'}</div>
        <div class="mk-w mono">${v == null ? `worth ${a.w}%` : `${fmt(a.w * v / 100)} / ${a.w}`}</div></div>`;
    }).join('') + `<div class="mk total"><div class="mk-n">Running Total</div><div class="mk-v mono">${fmt(totalMark(m))}</div><div class="mk-w">/ 100</div></div>`;

    const done = new Set(m.weeks);
    const CURRENT_WEEK = 2;
    $('#week-count').textContent = `${done.size}/14 weeks completed · Current: Week ${CURRENT_WEEK}`;
    $('#week-grid').innerHTML = WEEKS.map(w =>
      `<div class="wk ${done.has(w.w) ? 'done' : ''} ${w.w === CURRENT_WEEK ? 'current' : ''}" title="Week ${w.w}: ${w.t}"><b>W${w.w}</b><span>${w.t}</span><em>${w.clo.map(c => 'CLO' + c).join(' · ')}</em></div>`
    ).join('');

    const earned = badgesOf(m);
    const all = ['calendar Perfect Presence', 'check Task Master', 'target Test Ace', ...ACTIVITIES.map(a => a.badge), ...UNITS.map(u => u.badge)];
    const locked = all.filter(b => !earned.some(e => e.startsWith(b)));
    $('#my-badges').innerHTML = earned.map(b => `<span class="badge">${esc(b)}</span>`).join('') +
      locked.map(b => `<span class="badge locked" title="Not yet earned">${esc(b)}</span>`).join('');

    $('#ladder').innerHTML = ROLES.map((ro, i) => {
      const hi = ROLES[i + 1] ? `${ro.min}–${ROLES[i + 1].min - 1}` : `${ro.min}+`;
      return `<li class="r${i} ${i === m.ri ? 'cur' : i < m.ri ? 'done' : ''}"><span class="role-icon">${icon(ro.icon, true)}</span><span>${ro.name}</span><span class="rng">${hi} XP</span></li>`;
    }).join('');
  }

  function renderBoard(list) {
    const isGuest = sess?.role === 'guest';
    const m = isGuest ? null : list.find(s => s.id === state.meId);
    let rows = list;
    if (state.mode === 'relative' && !isGuest && m) {
      const i = m.rank - 1;
      let a = Math.max(0, i - 2), b = Math.min(list.length, a + 5);
      a = Math.max(0, b - 5);
      rows = list.slice(a, b);
      $('#mode-hint').textContent = 'Safe view: just you and the 2 peers directly above and below. Aim for the next step, not the summit.';
    } else {
      $('#mode-hint').textContent = isGuest
        ? 'Public view: full cohort ranking with active participants.'
        : 'Full cohort ranking. Everyone is shown under a de-identified pseudonym.';
    }
    const q = state.search.trim().toLowerCase();
    rows = rows.filter(s => {
      if (state.role !== '' && s.ri !== +state.role) return false;
      if (!q) return true;
      return dn(s).toLowerCase().includes(q) || ROLES[s.ri].name.toLowerCase().includes(q) ||
        badgesOf(s).some(b => b.toLowerCase().includes(q));
    });

    $('#lb-body').innerHTML = rows.map(s => {
      const r = ROLES[s.ri];
      const g = s.rank <= 3 ? ` g${s.rank}` : '';
      const isMe = !isGuest && s.id === state.meId;
      const gap = !isGuest && m && state.mode === 'relative' && !isMe
        ? `<span class="gap">${s.xp > m.xp ? '+' + (s.xp - m.xp) + ' ahead' : s.xp < m.xp ? (m.xp - s.xp) + ' behind' : 'level'}</span>` : '';
      return `<tr class="${isMe ? 'me' : ''} ${s.id === flashId ? 'flash' : ''}">
        <td><span class="rk${g}">${s.rank}</span></td>
        <td><div class="who"><span class="av">${icon(s.avatar, true)}</span><div><span class="nm">${esc(dn(s))}</span>${isMe ? '<span class="you">YOU</span>' : ''}</div></div></td>
        <td class="hide-sm"><span class="role-pill r${s.ri}">${icon(r.icon, true)} ${r.name}</span></td>
        <td class="num"><span class="xp">${s.xp}</span>${gap}</td>
        <td class="num hide-md">${s.task}%</td>
        <td class="num hide-md">${s.att}%</td></tr>`;
    }).join('');
    $('#lb-empty').hidden = rows.length > 0;
    document.querySelectorAll('.seg-btn[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === state.mode));
  }

  function renderStream() {
    const html = state.stream.slice(0, 40).map(e =>
      `<li class="${e.promo ? 'promo' : ''}"><span class="stream-icon">${icon(e.promo ? 'sparkles' : 'zap')}</span><div><div>${e.msg}</div><div class="t">${timeAgo(e.ts)}</div></div></li>`
    ).join('');
    const el = $('#stream-list');
    if (el && el.innerHTML !== html) {
      el.innerHTML = html;
    }
  }

  function renderSelectors(list) {
    const opt = s => `<option value="${s.id}"><span class="tier-dot tier-${s.tier.toLowerCase()}"></span> #${s.rank} ${esc(dn(s))}</option>`;
    const grp = (t, l) => `<optgroup label="${l}">${list.filter(s => s.tier === t).map(opt).join('')}</optgroup>`;
    const html = grp('Top', 'High engagement') + grp('Mid', 'Moderate engagement') + grp('Low', 'At-risk engagement');
    const va = $('#view-as'), ss = $('#sync-student');
    const keep = ss.value;
    va.innerHTML = html; va.value = state.meId;
    ss.innerHTML = list.map(opt).join(''); ss.value = keep || state.meId;
  }

  function render(triggerCloudSync = true) {
    const list = ranked();
    renderHub(list); renderBoard(list); renderStream(); renderSelectors(list);
    persist(triggerCloudSync);
  }

  // ---------- Static UI init ----------
  $('#role-filter').innerHTML += ROLES.map((r, i) => `<option value="${i}">${r.name}</option>`).join('');
  $('#sync-acts').innerHTML += ACTIVITIES.map((a, i) =>
    `<label class="act"><input type="radio" name="act" value="${a.id}" ${i === 0 ? 'checked' : ''}/> <span>${a.name}</span><span class="pts">+${a.xp}</span></label>`).join('');

  // ---------- Modals ----------
  const open = id => { $(id).hidden = false; };
  const closeAll = () => document.querySelectorAll('.modal').forEach(m => m.hidden = true);
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m || e.target.hasAttribute('data-close')) closeAll(); });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  $('#btn-research').onclick = () => open('#modal-research');
  $('#btn-sync').onclick = () => { $('#sync-student').value = state.meId; open('#modal-sync'); };
  $('#btn-avatar').onclick = () => {
    const cur = me().avatar;
    $('#avatar-grid').innerHTML = AVATARS.map(a => `<button class="${a === cur ? 'sel' : ''}" data-av="${a}">${icon(a, true)}</button>`).join('');
    open('#modal-avatar');
  };
  $('#avatar-grid').onclick = e => {
    const b = e.target.closest('[data-av]'); if (!b) return;
    me().avatar = b.dataset.av; closeAll(); toast(`Avatar updated to ${b.dataset.av}`); render();
    $('#btn-avatar').innerHTML = icon(b.dataset.av, true);
  };
  $('#toggle-real').onchange = e => {
    const m = me();
    if (e.target.checked && !m.realName) {
      e.target.checked = false;
      toast(`${icon('warning')} No real name on file. Ask the admin to add it.`);
      return;
    }
    m.showReal = e.target.checked;
    toast(m.showReal ? `${icon('user')} Now showing your real name: <b>${esc(m.realName)}</b>` : `${icon('user')} Now showing your pseudonym: <b>${esc(m.pseudo)}</b>`);
    render();
  };
  $('#btn-edit-name').onclick = () => { const cur = me().pseudo; $('#name-input').value = /^Participant_(Top|Mid|Low)_\d+$/i.test(cur) ? '' : cur; open('#modal-name'); setTimeout(() => $('#name-input').focus(), 50); };
  $('#name-form').onsubmit = e => {
    e.preventDefault();
    const v = $('#name-input').value.trim().replace(/\s+/g, '_');
    if (!v) { toast(`${icon('warning')} Please enter a pseudonym.`); return; }
    if (state.students.some(s => s.id !== state.meId && s.pseudo.toLowerCase() === v.toLowerCase())) {
      toast(`${icon('warning')} That pseudonym is already taken.`); return;
    }
    me().pseudo = v; closeAll(); toast(`Pseudonym saved: <b>${esc(v)}</b>`); render();
  };

  // Participant account settings (Change Login ID / Password)
  const btnToggleAccPw = $('#btn-toggle-acc-pw');
  const accPwInput = $('#acc-pw-input');
  if (btnToggleAccPw && accPwInput) {
    btnToggleAccPw.onclick = () => {
      const isPassword = accPwInput.type === 'password';
      accPwInput.type = isPassword ? 'text' : 'password';
      btnToggleAccPw.innerHTML = icon(isPassword ? 'eye-off' : 'eye');
      btnToggleAccPw.title = isPassword ? 'Hide password' : 'Show password';
      btnToggleAccPw.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    };
  }

  $('#btn-edit-account').onclick = () => {
    const m = me();
    const c = state.creds[m.id] || { uid: '', pw: '' };
    $('#acc-uid-input').value = c.uid || '';
    $('#acc-pw-input').value = c.pw || '';
    $('#acc-pw-input').type = 'password';
    if (btnToggleAccPw) btnToggleAccPw.innerHTML = icon('eye');
    $('#acc-err').textContent = '';
    open('#modal-account');
    setTimeout(() => $('#acc-uid-input').focus(), 50);
  };

  $('#account-form').onsubmit = e => {
    e.preventDefault();
    const m = me();
    const newUid = $('#acc-uid-input').value.trim().toUpperCase();
    const newPw = $('#acc-pw-input').value.trim();

    // Check if new ID is already taken by another participant
    const duplicate = Object.entries(state.creds || {}).find(([id, c]) => +id !== m.id && c.uid && c.uid.toUpperCase() === newUid);
    if (duplicate) {
      $('#acc-err').innerHTML = `${icon('warning')} That Login ID is already taken by another participant.`;
      return;
    }
    if (newPw.length < 4) {
      $('#acc-err').innerHTML = `${icon('warning')} Password must be at least 4 characters long.`;
      return;
    }

    state.creds[m.id] = { uid: newUid, pw: newPw };
    $('#who').innerHTML = `${icon('grad-cap')} ${esc(newUid)}`;
    closeAll();
    toast(`${icon('key')} Login ID updated to <b>${esc(newUid)}</b> and password saved!`);
    render();
  };

  // ---------- Sync submit ----------
  $('#sync-form').onsubmit = e => {
    e.preventDefault();
    const id = +$('#sync-student').value;
    const act = ACTIVITIES.find(a => a.id === document.querySelector('input[name="act"]:checked').value);
    const st = state.students.find(s => s.id === id);
    const before = ranked().find(s => s.id === id);
    st.xp += act.xp;
    st.acts[act.id] = (st.acts[act.id] || 0) + 1;
    st.task = Math.min(100, st.task + 1); // completed in-class task nudges completion rate
    const after = ranked().find(s => s.id === id);
    const note = $('#sync-note').value.trim();
    const wk = +$('#sync-week').value;
    if (wk && !st.weeks.includes(wk)) {
      st.weeks.push(wk); st.weeks.sort((a, b) => a - b);
      const u = UNITS.find(x => x.weeks.includes(wk) && x.weeks.every(w => st.weeks.includes(w)));
      if (u) {
        state.stream.unshift({ msg: `<b>${esc(dn(st))}</b> completed the <b>${u.name}</b> unit and earned ${u.badge}!`, ts: Date.now(), promo: true });
        toast(`${icon('medal')} <b>${esc(dn(st))}</b> earned ${u.badge}`, true);
      }
    }

    state.stream.unshift({ msg: `<b>${esc(dn(st))}</b> earned <b>+${act.xp} XP</b> for ${act.name}${note ? ` · <i>${esc(note)}</i>` : ''}`, ts: Date.now() });
    if (after.rank < before.rank) {
      state.stream.unshift({ msg: `<b>${esc(dn(st))}</b> climbed from #${before.rank} to <b>#${after.rank}</b> ${icon('chart-up')}`, ts: Date.now() });
    }
    if (after.ri > before.ri) {
      const r = ROLES[after.ri];
      state.stream.unshift({ msg: `<b>${esc(dn(st))}</b> promoted to <b>${r.icon} ${r.name}</b>!`, ts: Date.now(), promo: true });
      toast(`${icon('sparkles')} <b>${esc(dn(st))}</b> promoted to ${icon(r.icon, true)} <b>${r.name}</b>!`, true);
    }
    toast(`${icon('check')} +${act.xp} XP awarded to <b>${esc(dn(st))}</b> · now #${after.rank}`);
    $('#sync-note').value = '';
    flashId = id; closeAll(); render();
    setTimeout(() => { flashId = null; }, 1700);
  };

  // ---------- Controls ----------
  $('#view-as').onchange = e => { state.meId = +e.target.value; toast(`Now viewing as <b>${esc(me().pseudo)}</b>`); render(); };
  document.querySelectorAll('.seg-btn[data-mode]').forEach(b => b.onclick = () => { state.mode = b.dataset.mode; render(); });
  $('#search').oninput = e => { state.search = e.target.value; render(); };
  $('#role-filter').onchange = e => { state.role = e.target.value; render(); };
  $('#btn-manage-xp').onclick = () => { renderManageXP(); open('#modal-manage-xp'); };
  function renderManageXP() {
    $('#mxp-body').innerHTML = [...state.students].sort((a, b) => a.id - b.id).map(s => `
      <tr data-mxp="${s.id}">
        <td><div class="who-cell"><span class="av">${icon(s.avatar, true)}</span><span>${esc(s.realName || s.pseudo)}</span></div></td>
        <td class="num mono"><b>${s.xp}</b></td>
        <td class="adm-act">
          <button class="btn btn-outline sm" data-xp-add="${s.id}" data-xp-amt="10">+10</button>
          <button class="btn btn-outline sm" data-xp-add="${s.id}" data-xp-amt="30">+30</button>
          <button class="btn btn-outline sm" data-xp-add="${s.id}" data-xp-amt="50">+50</button>
          <button class="btn btn-outline sm" data-xp-sub="${s.id}" data-xp-amt="10">−10</button>
          <button class="btn btn-outline sm" data-xp-sub="${s.id}" data-xp-amt="30">−30</button>
          <button class="btn btn-outline sm" data-xp-sub="${s.id}" data-xp-amt="50">−50</button>
        </td>
      </tr>`).join('');
  }
  $('#mxp-body').onclick = e => {
    const add = e.target.closest('[data-xp-add]'), sub = e.target.closest('[data-xp-sub]');
    if (!add && !sub) return;
    const id = +(add || sub).dataset.xpAdd || +(add || sub).dataset.xpSub;
    const amt = +(add || sub).dataset.xpAmt;
    const st = state.students.find(s => s.id === id);
    if (!st) return;
    st.xp = Math.max(0, st.xp + (add ? amt : -amt));
    prepareStudent(st);
    renderManageXP(); render();
    toast(`${icon('zap')} XP updated for <b>${esc(st.realName || st.pseudo)}</b>`);
  };

  // ---------- Auth & access management ----------
  const SESS_KEY = 'smjc3283_session';
  let sess = JSON.parse(sessionStorage.getItem(SESS_KEY) || 'null');
  let loginMode = 'participant';
  const rand = (alpha, n) => {
    const a = crypto.getRandomValues(new Uint32Array(n));
    return Array.from(a, x => alpha[x % alpha.length]).join('');
  };
  const genPw = () => rand('ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789', 8);
  function genUid() {
    const used = new Set(Object.values(state.creds).map(c => c.uid));
    let u; do { u = 'SP-' + rand('0123456789', 4); } while (used.has(u));
    return u;
  }
  function generateFor(id) { state.creds[id] = { uid: genUid(), pw: genPw() }; }

  function applySession() {
    const ok = !!sess;
    const isGuest = sess?.role === 'guest';
    document.body.classList.toggle('locked', !ok);
    document.body.classList.toggle('is-admin', ok && sess.role === 'admin');
    document.body.classList.toggle('is-guest', ok && isGuest);
    if (!ok) return;
    if (sess.role === 'participant') state.meId = sess.id;
    if (isGuest) {
      state.mode = 'absolute';
      $('#who').innerHTML = `${icon('eye')} Guest Viewer`;
    } else {
      $('#who').innerHTML = sess.role === 'admin' ? `${icon('shield')} Admin` : `${icon('grad-cap')} ${esc(state.creds[sess.id]?.uid || '')}`;
    }
    render();
  }

  function showLoginScreen() {
    sess = null;
    sessionStorage.removeItem(SESS_KEY);
    loginMode = 'participant';
    document.querySelectorAll('[data-login]').forEach(x => x.classList.toggle('active', x.dataset.login === 'participant'));
    $('#lbl-uid').hidden = false;
    $('#login-hint').textContent = 'Your ID and password are issued by your instructor.';
    $('#login-err').textContent = '';
    $('#login-pw').value = '';
    if (btnTogglePw) btnTogglePw.innerHTML = icon('eye');
    closeAll();
    applySession();
  }

  $('#btn-guest-view').onclick = () => {
    sess = { role: 'guest' };
    sessionStorage.setItem(SESS_KEY, JSON.stringify(sess));
    applySession();
    toast(`${icon('eye')} Viewing leaderboard as <b>Guest</b>`);
  };

  const guestLogin = $('#btn-guest-login');
  if (guestLogin) guestLogin.onclick = showLoginScreen;
  const bannerLogin = $('#btn-banner-login');
  if (bannerLogin) bannerLogin.onclick = showLoginScreen;

  document.querySelectorAll('[data-login]').forEach(b => b.onclick = () => {
    loginMode = b.dataset.login;
    document.querySelectorAll('[data-login]').forEach(x => x.classList.toggle('active', x === b));
    $('#lbl-uid').hidden = loginMode === 'admin';
    $('#login-hint').textContent = loginMode === 'admin'
      ? 'Enter the admin password to manage the leaderboard.'
      : 'Your ID and password are issued by your instructor.';
    $('#login-err').textContent = '';
  });

  const pwInput = $('#login-pw');
  const btnTogglePw = $('#btn-toggle-pw');
  if (btnTogglePw && pwInput) {
    btnTogglePw.onclick = () => {
      const isPassword = pwInput.type === 'password';
      pwInput.type = isPassword ? 'text' : 'password';
      btnTogglePw.innerHTML = icon(isPassword ? 'eye-off' : 'eye');
      btnTogglePw.title = isPassword ? 'Hide password' : 'Show password';
      btnTogglePw.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    };
  }

  $('#login-form').onsubmit = e => {
    e.preventDefault();
    const pw = $('#login-pw').value.trim();
    if (loginMode === 'admin') {
      if (pw !== state.adminPw) { $('#login-err').textContent = 'Incorrect admin password.'; return; }
      sess = { role: 'admin' };
    } else {
      const uid = $('#login-uid').value.trim().toUpperCase();
      const hit = Object.entries(state.creds || {}).find(([, c]) => 
        c && c.uid && c.uid.trim().toUpperCase() === uid && c.pw && c.pw.trim() === pw
      );
      if (!hit) {
        if (!state.creds || Object.keys(state.creds).length === 0) {
          $('#login-err').textContent = 'No participant accounts generated yet. Please log in as Admin first to generate IDs.';
        } else {
          $('#login-err').textContent = 'Invalid participant ID or password. Check case sensitivity.';
        }
        return;
      }
      sess = { role: 'participant', id: +hit[0] };
    }
    sessionStorage.setItem(SESS_KEY, JSON.stringify(sess));
    $('#login-pw').value = ''; $('#login-err').textContent = '';
    applySession();
    toast(sess.role === 'admin' ? 'Signed in as <b>Admin</b>' : `Welcome back, <b>${esc(dn(me()))}</b>!`);
  };

  $('#btn-logout').onclick = () => {
    sess = null; sessionStorage.removeItem(SESS_KEY); closeAll(); applySession();
  };

  function renderAdmin() {
    const list = ranked().slice().sort((a, b) => a.id - b.id);
    $('#adm-body').innerHTML = list.map(s => {
      const c = state.creds[s.id];
      return `<tr>
        <td><div class="who-cell"><span class="av">${icon(s.avatar, true)}</span><span>${esc(s.realName || s.pseudo)}</span></div></td>
        <td><input class="rn-in" data-rn="${s.id}" value="${esc(s.realName || '')}" placeholder="Real name" maxlength="40" />${s.showReal ? ` <span title="Shown publicly">${icon('user')}</span>` : ''}</td>
        <td class="mono">${c ? c.uid : '<span class="muted">—</span>'}</td>
        <td class="mono">${c ? c.pw : '<span class="muted">—</span>'}</td>
        <td class="num adm-act">
          <button class="btn btn-outline sm" data-gen="${s.id}">${c ? `${icon('refresh')} Regenerate` : `${icon('sparkles')} Generate`}</button>
          ${c ? `<button class="btn btn-outline sm" data-copy="${s.id}">${icon('clipboard')}</button><button class="btn btn-outline sm" data-revoke="${s.id}">${icon('x')}</button>` : ''}
          <button class="btn btn-outline sm" data-remove="${s.id}">${icon('x')} Remove</button>
        </td></tr>`;
    }).join('');
  }
  const credLine = id => { const s = state.students.find(x => x.id === id), c = state.creds[id]; return `${s.pseudo}\t${c.uid}\t${c.pw}`; };

  $('#btn-admin').onclick = () => { renderAdmin(); open('#modal-admin'); };
  $('#adm-body').onchange = e => {
    const i = e.target; if (!i.dataset.rn) return;
    const st = state.students.find(s => s.id === +i.dataset.rn);
    st.realName = i.value.trim().slice(0, 40);
    if (!st.realName) st.showReal = false;
    toast('Real name saved'); render(); renderAdmin();
  };
  $('#adm-body').onclick = e => {
    const g = e.target.closest('[data-gen]'), cp = e.target.closest('[data-copy]'), rv = e.target.closest('[data-revoke]');
    if (g) {
      const id = +g.dataset.gen;
      if (state.creds[id] && !confirm('Regenerate? The old ID and password will stop working.')) return;
      generateFor(id); toast(`${icon('key')} Credentials generated`); 
    } else if (cp) {
      navigator.clipboard.writeText(credLine(+cp.dataset.copy)); toast(`${icon('clipboard')} Copied`); return;
    } else if (rv) {
      if (!confirm('Revoke access for this participant?')) return;
      delete state.creds[+rv.dataset.revoke]; toast('Access revoked');
    } else {
      const rm = e.target.closest('[data-remove]');
      if (rm) {
        const id = +rm.dataset.remove;
        if (!confirm('Remove this participant?')) return;
        state.students = state.students.filter(s => s.id !== id);
        delete state.creds[id];
        persist(); renderAdmin(); render(); toast(`${icon('x')} Participant removed`); return;
      }
    }
    persist(); renderAdmin();
  };
  $('#adm-gen-missing').onclick = () => {
    let n = 0; state.students.forEach(s => { if (!state.creds[s.id]) { generateFor(s.id); n++; } });
    persist(); renderAdmin(); toast(n ? `${icon('sparkles')} Generated ${n} new credential${n > 1 ? 's' : ''}` : 'Everyone already has credentials');
  };
  $('#adm-add').onclick = () => {
    const name = (prompt('New participant pseudonym:') || '').trim();
    if (!name) return;
    const newId = (state.students.reduce((a,st)=>Math.max(a,st.id),0) || 0) + 1;
    const st = {
      id: newId, tier: 'Mid', pseudo: name.replace(/\s+/g,'_'),
      xp: 0, att: 0, task: 0, mid: 50, avatar: AVATARS[(newId*7)%AVATARS.length],
      acts: {}, weeks: [1], marks: { quiz: null, t1: null, proj: null, final: null },
      realName: null, showReal: false,
      attendance: Array(28).fill(false)
    };
    prepareStudent(st);
    state.students.push(st);
    persist(); renderAdmin(); render(); toast(`${icon('plus')} Participant added`);
  };
  const issued = () => state.students.filter(s => state.creds[s.id]).sort((a, b) => a.id - b.id);
  $('#adm-copy').onclick = () => {
    const rows = issued(); if (!rows.length) return toast('No credentials yet');
    navigator.clipboard.writeText('Pseudonym\tLogin ID\tPassword\n' + rows.map(s => credLine(s.id)).join('\n'));
    toast(`${icon('clipboard')} Copied ${rows.length} credentials`);
  };
  $('#adm-export').onclick = () => {
    const rows = issued(); if (!rows.length) return toast('No credentials yet');
    const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = '\uFEFFPseudonym,Real Name,Tier,Login ID,Password\n' + rows.map(s => [s.pseudo, s.realName, s.tier, state.creds[s.id].uid, state.creds[s.id].pw].map(q).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'smjc3263_credentials.csv'; a.click();
  };
  $('#adm-admin-pw').onclick = () => {
    const v = prompt('New admin password (min 6 characters):');
    if (v == null) return;
    if (v.length < 6) return toast(`${icon('warning')} Password too short`);
    state.adminPw = v; persist(); toast(`${icon('shield')} Admin password updated`);
  };

  // ---------- Course weeks in sync form ----------
  $('#sync-week').innerHTML += WEEKS.map(w => `<option value="${w.w}">Week ${w.w} · ${w.t}</option>`).join('');

  // ---------- Admin: attendance ----------
  function attendanceRow(s) {
    const onGoal = s.att >= GOALS.attendance;
    const cells = Array.from({ length: 14 }, (_, week) => {
      const first = week * 2, second = first + 1;
      return `<td class="attendance-week"><label title="Week ${week + 1}, session 1"><input type="checkbox" data-att-session="${first}" ${s.attendance[first] ? 'checked' : ''} /><span>1</span></label><label title="Week ${week + 1}, session 2"><input type="checkbox" data-att-session="${second}" ${s.attendance[second] ? 'checked' : ''} /><span>2</span></label></td>`;
    }).join('');
    return `<tr data-att-student="${s.id}"><td><div class="who-cell"><span class="av">${icon(s.avatar, true)}</span><span>${esc(s.realName || s.pseudo)}</span></div></td>` +
      cells + `<td class="attendance-all"><input type="checkbox" data-att-all ${s.attendance.every(Boolean) ? 'checked' : ''} aria-label="Mark all sessions for ${esc(s.realName || s.pseudo)}" /></td>` +
      `<td class="num mono" data-attendance-total>${s.att}%<small> (${s.attendance.filter(Boolean).length}/28)</small></td>` +
      `<td class="num" data-attendance-status><span class="goal ${onGoal ? 'ok' : 'no'}">${onGoal ? icon('check') + ' Goal met' : `Goal ≥${GOALS.attendance}%`}</span></td></tr>`;
  }
  function renderAttendance() {
    const everyonePresent = state.students.every(s => s.attendance.every(Boolean));
    const weeklyTicks = Array.from({ length: 14 }, (_, i) => {
      const allWk = state.students.every(s => s.attendance[i * 2] && s.attendance[i * 2 + 1]);
      return `<th class="attendance-head">W${i + 1}<br><input type="checkbox" class="att-tick-wk" data-wk="${i}" ${allWk ? 'checked' : ''} title="Tick all for week ${i + 1}"/><small>1 · 2</small></th>`;
    }).join('');
    $('#attendance-head').innerHTML = `<tr><th>Participant</th>${weeklyTicks}<th>All<br><input type="checkbox" id="attendance-all-students" title="Mark every participant present for all sessions" ${everyonePresent ? 'checked' : ''} /></th><th class="num">Total</th><th class="num">Status</th></tr>`;
    $('#attendance-body').innerHTML = [...state.students].sort((a, b) => a.id - b.id)
      .map(attendanceRow).join('');
  }
  $('#btn-attendance').onclick = () => { renderAttendance(); open('#modal-attendance'); };
  
  // New handler for weekly tick
  $('#attendance-head').onchange = e => {
    if (e.target.classList.contains('att-tick-wk')) {
        const wk = +e.target.dataset.wk;
        const checked = e.target.checked;
        state.students.forEach(s => {
            s.attendance[wk * 2] = checked;
            s.attendance[wk * 2 + 1] = checked;
            prepareStudent(s);
        });
        renderAttendance(); render();
        toast(`${icon(checked ? 'check' : 'x')} Week ${wk + 1} attendance updated`);
    } else if (e.target.id === 'attendance-all-students') {
        state.students.forEach(s => { s.attendance = Array(28).fill(e.target.checked); prepareStudent(s); });
        renderAttendance(); render();
        toast(e.target.checked ? `${icon('calendar')} All participants marked present for all sessions` : `${icon('calendar')} Attendance cleared for all participants`);
    }
  };
  $('#attendance-export').onclick = () => {
    const rows = [...state.students].sort((a, b) => a.id - b.id)
      .map(s => `"${s.pseudo.replace(/"/g, '""')}",${s.tier},${s.attendance.map(v => v ? 'Present' : 'Absent').join(',')},${s.att}%`);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([['Pseudonym,Tier,' + Array.from({ length: 14 }, (_, i) => `Week ${i + 1} Session 1,Week ${i + 1} Session 2`).join(',') + ',Attendance', ...rows].join('\n')], { type: 'text/csv' }));
    a.download = 'smjc3263_attendance.csv'; a.click();
  };

  // ---------- Admin: assessment marks ----------
  function marksRow(s) {
    const t = totalMark(s);
    return `<td><div class="who-cell"><span class="av">${icon(s.avatar, true)}</span><span>${esc(s.realName || s.pseudo)}</span></div></td>` +
      ASSESS.map(a => `<td><input class="mk-in mono" type="number" min="0" max="100" step="0.5" data-id="${s.id}" data-a="${a.id}" value="${s.marks[a.id] ?? ''}" placeholder="—" /></td>`).join('') +
      `<td class="num mono" data-carry>${fmt(carryMark(s))}</td><td class="num mono" data-total><b>${fmt(t)}</b> <span class="gr">${grade(t)}</span></td>`;
  }
  function renderMarks() {
    $('#marks-body').innerHTML = [...state.students].sort((a, b) => a.id - b.id)
      .map(s => `<tr data-row="${s.id}">${marksRow(s)}</tr>`).join('');
  }
  $('#btn-marks').onclick = () => { renderMarks(); open('#modal-marks'); };
  $('#btn-clear-all-marks').onclick = () => {
    if (confirm('Clear ALL marks for ALL participants? This cannot be undone.')) {
        state.students.forEach(s => { s.marks = { quiz: null, t1: null, proj: null, final: null }; });
        renderMarks(); render(); toast(`${icon('edit')} All assessment marks cleared.`);
    }
  };
  $('#marks-body').onchange = e => {
    const i = e.target; if (!i.dataset.a) return;
    const st = state.students.find(s => s.id === +i.dataset.id);
    const raw = i.value.trim();
    if (raw === '') st.marks[i.dataset.a] = null;
    else {
      const v = +raw;
      if (isNaN(v) || v < 0 || v > 100) { toast(`${icon('warning')} Marks must be between 0 and 100`); i.value = st.marks[i.dataset.a] ?? ''; return; }
      st.marks[i.dataset.a] = Math.round(v * 10) / 10;
    }
    const row = i.closest('tr');
    row.querySelector('[data-carry]').textContent = fmt(carryMark(st));
    const t = totalMark(st);
    row.querySelector('[data-total]').innerHTML = `<b>${fmt(t)}</b> <span class="gr">${grade(t)}</span>`;
    render();
  };
  $('#marks-export').onclick = () => {
    const head = ['Pseudonym', ...ASSESS.map(a => `${a.name} (${a.w}%)`), 'Carry /60', 'Total /100', 'Grade'];
    const rows = [...state.students].sort((a, b) => a.id - b.id).map(s => [s.pseudo, ...ASSESS.map(a => s.marks[a.id] ?? ''), fmt(carryMark(s)), fmt(totalMark(s)), grade(totalMark(s))]);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([[head, ...rows].map(r => r.join(',')).join('\n')], { type: 'text/csv' }));
    a.download = 'smjc3263_marks.csv'; a.click();
  };

  // ---------- Admin: Research Data Tracker & Excel Export ----------
  function renderResearchTracker() {
    const list = ranked();
    const totalXp = list.reduce((sum, s) => sum + s.xp, 0);
    const avgXp = Math.round(totalXp / list.length);
    const topTierCount = list.filter(s => s.tier === 'Top').length;
    $('#rt-summary').textContent = `Cohort: N = ${list.length} | Avg XP: ${avgXp} | Top: ${topTierCount}`;

    $('#rt-body').innerHTML = list.map(s => {
      const r = ROLES[s.ri];
      const t = totalMark(s);
      const weeksDone = s.weeks ? s.weeks.length : 0;
      const acts = s.acts || {};
      return `<tr>
        <td class="mono">#${s.rank}</td>
        <td><div class="who-cell"><span class="av">${icon(s.avatar, true)}</span><span><b>${esc(s.pseudo)}</b>${s.realName ? ` <small class="muted">(${esc(s.realName)})</small>` : ''}</span></div></td>
        <td>${s.tier}</td>
        <td class="num"><b>${s.xp}</b></td>
        <td>${r.icon} ${r.name}</td>
        <td class="num">${s.task}%</td>
        <td class="num">${s.att}%</td>
        <td class="num">${weeksDone}/14</td>
        <td class="num">${acts.al || 0}</td>
        <td class="num">${acts.quiz || 0}</td>
        <td class="num">${acts.tut || 0}</td>
        <td class="num">${acts.proj || 0}</td>
        <td class="num">${acts.peer || 0}</td>
        <td class="num">${fmt(carryMark(s))}</td>
        <td class="num"><b>${fmt(t)}</b></td>
        <td><span class="gr">${grade(t)}</span></td>
      </tr>`;
    }).join('');
  }

  $('#btn-research-tracker').onclick = () => {
    renderResearchTracker();
    open('#modal-research-tracker');
  };

  $('#rt-export-excel').onclick = () => {
    const list = ranked();
    const headers = [
      'Rank', 'Participant_ID', 'Pseudonym', 'Real_Name', 'Showing_Real_Name', 'Tier',
      'XP', 'Career_Role', 'Task_Completion_Rate_Pct', 'Attendance_Rate_Pct',
      'Weeks_Completed_Count', 'Completed_Week_Numbers',
      'Active_Learning_Count', 'Quizzes_Submitted_Count', 'Tutorial_Whiteboard_Count',
      'Project_Presentation_Count', 'Peer_Mentorship_Count',
      'Quiz_Mark_Pct', 'Test1_Mark_Pct', 'Test2_Mark_Pct', 'Project_Mark_Pct', 'Final_Exam_Mark_Pct',
      'Carry_Mark_Over_60', 'Total_Mark_Over_100', 'Grade',
      'Badges_Earned'
    ];

    const rows = list.map(s => {
      const c = state.creds[s.id] || {};
      const r = ROLES[s.ri];
      const acts = s.acts || {};
      const bList = badgesOf(s).join('; ');
      const wList = (s.weeks || []).join('; ');
      return [
        s.rank,
        `"${c.uid || ''}"`,
        `"${s.pseudo || ''}"`,
        `"${s.realName || ''}"`,
        s.showReal ? 'YES' : 'NO',
        `"${s.tier}"`,
        s.xp,
        `"${r.name}"`,
        s.task,
        s.att,
        (s.weeks || []).length,
        `"${wList}"`,
        acts.al || 0,
        acts.quiz || 0,
        acts.tut || 0,
        acts.proj || 0,
        acts.peer || 0,
        s.marks.quiz ?? '',
        s.marks.t1 ?? '',
        s.marks.proj ?? '',
        s.marks.final ?? '',
        fmt(carryMark(s)),
        fmt(totalMark(s)),
        grade(totalMark(s)),
        `"${bList}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `SMJC3263_Research_Dataset_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast(`${icon('chart')} Research dataset exported for Excel / SPSS`);
  };

  $('#rt-export-logs').onclick = () => {
    if (!state.stream || !state.stream.length) {
      toast('No stream logs to export.');
      return;
    }
    const headers = ['Timestamp', 'Date_Time_ISO', 'Activity_Message', 'Is_Promotion'];
    const rows = state.stream.map(e => {
      const cleanMsg = (e.msg || '').replace(/<[^>]+>/g, '');
      return [
        e.ts,
        `"${new Date(e.ts).toISOString()}"`,
        `"${cleanMsg.replace(/"/g, '""')}"`,
        e.promo ? 'YES' : 'NO'
      ];
    });
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `SMJC3263_Activity_Logs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast(`${icon('scroll')} Activity stream logs exported`);
  };

  $('#btn-course').onclick = () => open('#modal-course');

  $('#search').value = state.search; $('#role-filter').value = state.role;
  applySession();
  initFirestoreSync();
  if (!sess) render();
  setInterval(renderStream, 30000);
})();
