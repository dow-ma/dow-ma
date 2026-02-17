export interface Project {
    name: string;
    url: string;
    description?: {
        en: string;
        zh: string;
    }
}

export interface Dictionary {
    profile: {
        title: string;
        role: string;
        bio: string;
        badges: {
            vibeCoding: string;
            agenticAi: string;
            digitalNomad: string;
        };
        opcManual: string;
    };
    projects: {
        title: string;
        list: Project[];
    };
    articles: {
        title: string;
        date: string;
        tag: string;
    };
    footer: string;
}
