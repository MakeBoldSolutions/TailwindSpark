import { describe, expect, it } from 'vitest';
import { PROJECTS_API_CONFIG, mapRawProjectsResponse, mapRawSubsite } from './projects-api';

describe('projects-api', () => {
  it('uses Make Bold Spark subsites as the remote source', () => {
    expect(PROJECTS_API_CONFIG.REMOTE_URL).toBe('https://makeboldspark.com/subsites.json');
    expect(PROJECTS_API_CONFIG.DEV_URL).toBe('/api/subsites.json');
    expect(PROJECTS_API_CONFIG.PROD_URL).toBe('/data/projects.json');
  });

  it('maps a Make Bold Spark subsite to a project card model', () => {
    const project = mapRawSubsite(
      {
        id: 'dev',
        name: 'DevSpark',
        displayName: 'DevSpark',
        description: 'Specification-driven development initiative.',
        tagline: 'From Requirements to Working Software',
        url: 'https://dev.makeboldspark.com',
        icon: '*',
        sortOrder: 10,
        strategicCategory: 'flagship-initiatives',
        initiativeType: 'flagship-initiative',
        hostType: 'github',
        tag: 'GitHub Pages',
        deliveryPattern: 'Requirements -> Specifications -> Working Software',
        status: 'Flagship Initiative',
        featured: true,
        capabilities: ['specification-driven development', 'workflow guidance'],
        relatedInitiatives: ['apitest'],
        links: {
          site: 'https://dev.makeboldspark.com',
        },
      },
      0
    );

    expect(project).toEqual({
      id: 10,
      name: 'DevSpark',
      description: 'Specification-driven development initiative.',
      image_url: '',
      project_url: 'https://dev.makeboldspark.com',
      status: 'Flagship Initiative',
      technologies: ['specification-driven development', 'workflow guidance'],
      featured: true,
      category_id: 'flagship-initiatives',
      tagline: 'From Requirements to Working Software',
      icon: '*',
      delivery_pattern: 'Requirements -> Specifications -> Working Software',
      initiative_type: 'flagship-initiative',
      host_type: 'github',
      host_tag: 'GitHub Pages',
      related_initiatives: ['apitest'],
    });
  });

  it('maps the subsites response object to project card models', () => {
    const projects = mapRawProjectsResponse({
      subsites: [
        {
          id: 'web',
          name: 'WebSpark',
          description: 'Application framework initiative.',
          url: 'https://web.makeboldspark.com',
          status: 'Reference Implementation',
        },
      ],
    });

    expect(projects).toHaveLength(1);
    expect(projects[0].name).toBe('WebSpark');
    expect(projects[0].project_url).toBe('https://web.makeboldspark.com');
  });
});
