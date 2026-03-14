export type ProjectType = 'Frontend' | 'API' | 'Backend' | 'Mobile' | 'Database';
export type TechnologyColor = 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'orange';

export interface Technology {
    name: string;
    color: TechnologyColor;
}

export interface ProjectCard {
    title: string;
    type: ProjectType;
    technology: Technology;
    description: string;
    version: string;
    framework: string;
    developers: number;
}