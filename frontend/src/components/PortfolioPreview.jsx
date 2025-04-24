import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  GithubIcon, 
  ExternalLinkIcon, 
  MailIcon, 
  PhoneIcon, 
  LinkedinIcon, 
  TwitterIcon, 
  InstagramIcon,
  CalendarIcon,
  AwardIcon,
  BriefcaseIcon,
  BookOpenIcon,
  CodeIcon,
  UserIcon,
  WrenchIcon,
  MapPinIcon
} from 'lucide-react';

// These CSS variables will be applied based on the theme
const themeStyles = {
  CLASSIC: {
    '--primary-color': 'hsl(215, 20%, 65%)',
    '--secondary-color': 'hsl(240, 5%, 96%)',
    '--accent-color': 'hsl(221, 83%, 53%)',
    '--header-bg': 'hsl(210, 20%, 98%)',
    '--section-bg': 'hsl(0, 0%, 100%)',
    '--card-bg': 'hsl(210, 20%, 98%)',
    '--skill-bg': 'hsl(221, 83%, 53%, 0.1)',
    '--skill-text': 'hsl(221, 83%, 53%)',
    '--tag-bg': 'hsl(215, 20%, 65%, 0.2)',
    '--tag-text': 'hsl(215, 20%, 65%)'
  },
  MODERN: {
    '--primary-color': 'hsl(265, 89%, 78%)',
    '--secondary-color': 'hsl(244, 76%, 60%)',
    '--accent-color': 'hsl(265, 83%, 45%)',
    '--header-bg': 'hsl(265, 89%, 9%)',
    '--section-bg': 'hsl(244, 76%, 6%)',
    '--card-bg': 'hsl(265, 50%, 12%)',
    '--skill-bg': 'hsl(265, 83%, 45%, 0.2)',
    '--skill-text': 'hsl(265, 89%, 78%)',
    '--tag-bg': 'hsl(244, 76%, 60%, 0.2)',
    '--tag-text': 'hsl(244, 76%, 90%)'
  },
  MINIMAL: {
    '--primary-color': 'hsl(0, 0%, 40%)',
    '--secondary-color': 'hsl(20, 5%, 90%)',
    '--accent-color': 'hsl(0, 0%, 20%)',
    '--header-bg': 'hsl(0, 0%, 100%)',
    '--section-bg': 'hsl(0, 0%, 98%)',
    '--card-bg': 'hsl(0, 0%, 100%)',
    '--skill-bg': 'hsl(0, 0%, 95%)',
    '--skill-text': 'hsl(0, 0%, 20%)',
    '--tag-bg': 'hsl(0, 0%, 92%)',
    '--tag-text': 'hsl(0, 0%, 40%)'
  },
  CREATIVE: {
    '--primary-color': 'hsl(355, 90%, 80%)',
    '--secondary-color': 'hsl(330, 80%, 85%)',
    '--accent-color': 'hsl(24, 100%, 62%)',
    '--header-bg': 'hsl(355, 90%, 10%)',
    '--section-bg': 'hsl(330, 80%, 8%)',
    '--card-bg': 'hsl(330, 50%, 15%)',
    '--skill-bg': 'hsl(24, 100%, 62%, 0.2)',
    '--skill-text': 'hsl(24, 100%, 62%)',
    '--tag-bg': 'hsl(355, 90%, 80%, 0.2)',
    '--tag-text': 'hsl(355, 90%, 80%)'
  }
};

export default function PortfolioPreview({ components = [], theme = 'classic' }) {
  const currentTheme = theme.toUpperCase();
  console.log(currentTheme);
  const themeVariables = themeStyles[currentTheme] || themeStyles.CLASSIC;

  // Sort components based on their order property if available
  const sortedComponents = [...components].sort((a, b) => {
    return (a.order || 0) - (b.order || 0);
  });

  const renderComponent = (component) => {
    switch (component.type) {
      case 'header':
        return (
          <header 
            className="py-24 px-6 text-center relative"
            style={{ 
              background: 'var(--header-bg)',
              color: 'var(--accent-color)'
            }}
          >
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                {component.content?.title || "Your Name"}
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
                {component.content?.subtitle || "Your Professional Title"}
              </p>
            </div>
          </header>
        );

      case 'about':
        return (
          <section className="py-16 px-6" style={{ background: 'var(--section-bg)' }}>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center mb-6">
                <UserIcon className="mr-2" style={{ color: 'var(--accent-color)' }} />
                <h2 className="text-2xl font-bold">About Me</h2>
              </div>
              <Separator className="mb-6" />
              <Card>
                <CardContent className="pt-6">
                  <div className="prose prose-lg max-w-none">
                    <p className="whitespace-pre-line leading-relaxed">
                      {component.content?.text || "Add your bio here..."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        );

      case 'skills':
        return (
          <section 
            className="py-16 px-6" 
            style={{ background: 'var(--section-bg)' }}
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center mb-6">
                <WrenchIcon className="mr-2" style={{ color: 'var(--accent-color)' }} />
                <h2 className="text-2xl font-bold">Skills</h2>
              </div>
              <Separator className="mb-6" />
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-3">
                    {(component.content?.skills || []).map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        style={{ 
                          background: 'var(--skill-bg)',
                          color: 'var(--skill-text)',
                          borderColor: 'transparent'
                        }}
                        className="px-4 py-2 text-base rounded-full"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {(component.content?.skills || []).length === 0 && (
                      <p className="text-muted-foreground">Add your skills...</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        );

      case 'projects':
        return (
          <section 
            className="py-16 px-6" 
            style={{ background: 'var(--section-bg)' }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-6">
                <CodeIcon className="mr-2" style={{ color: 'var(--accent-color)' }} />
                <h2 className="text-2xl font-bold">Projects</h2>
              </div>
              <Separator className="mb-6" />
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between">
                    <CardTitle className="text-xl">
                      {component.content?.projectTitle || "Project Title"}
                    </CardTitle>
                    <div className="flex gap-4 mt-2 md:mt-0">
                      {component.content?.githubUrl && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                          style={{ color: 'var(--accent-color)' }}
                        >
                          <a href={component.content.githubUrl} target="_blank" rel="noopener noreferrer">
                            <GithubIcon className="mr-2 h-4 w-4" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {component.content?.demoUrl && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                          style={{ color: 'var(--accent-color)' }}
                        >
                          <a href={component.content.demoUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLinkIcon className="mr-2 h-4 w-4" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                  {component.content?.duration && (
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {component.content.duration}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <p>{component.content?.projectDescription || "Project description..."}</p>
                  
                  {(component.content?.techStack?.length > 0) && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {component.content.techStack.map((tech, i) => (
                          <Badge 
                            key={i} 
                            variant="secondary"
                            style={{ 
                              background: 'var(--tag-bg)',
                              color: 'var(--tag-text)'
                            }}
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {component.content?.features && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Features</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {component.content.features.split('\n').map((feature, i) => (
                          feature.trim() && (
                            <li key={i} className="pl-1">{feature}</li>
                          )
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {component.content?.challenges && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Challenges & Solutions</h4>
                      <p className="whitespace-pre-line">{component.content.challenges}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        );

      case 'experience':
        return (
          <section className="py-16 px-6" style={{ background: 'var(--section-bg)' }}>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center mb-6">
                <BriefcaseIcon className="mr-2" style={{ color: 'var(--accent-color)' }} />
                <h2 className="text-2xl font-bold">Experience</h2>
              </div>
              <Separator className="mb-6" />
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="text-xl font-semibold">{component.content?.position || "Position Title"}</div>
                    <div className="text-lg mt-1 font-normal text-muted-foreground">
                      {component.content?.company || "Company Name"}
                    </div>
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>
                      {component.content?.startDate || "Start Date"} — {component.content?.endDate || "Present"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">
                    {component.content?.description || "Experience description..."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        );

      case 'education':
        return (
          <section className="py-16 px-6" style={{ background: 'var(--section-bg)' }}>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center mb-6">
                <BookOpenIcon className="mr-2" style={{ color: 'var(--accent-color)' }} />
                <h2 className="text-2xl font-bold">Education</h2>
              </div>
              <Separator className="mb-6" />
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="text-xl font-semibold">{component.content?.degree || "Degree/Certificate"}</div>
                    <div className="text-lg mt-1 font-normal text-muted-foreground">
                      {component.content?.institution || "Institution Name"}
                    </div>
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>
                      {component.content?.startDate || "Start Date"} — {component.content?.endDate || "End Date"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{component.content?.description || "Education description..."}</p>
                </CardContent>
              </Card>
            </div>
          </section>
        );

      case 'achievements':
        return (
          <section className="py-16 px-6" style={{ background: 'var(--section-bg)' }}>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center mb-6">
                <AwardIcon className="mr-2" style={{ color: 'var(--accent-color)' }} />
                <h2 className="text-2xl font-bold">Achievements</h2>
              </div>
              <Separator className="mb-6" />
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {component.content?.title || "Achievement Title"}
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {component.content?.year || "Year"}
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{component.content?.description || "Achievement description..."}</p>
                </CardContent>
              </Card>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section className="py-16 px-6" style={{ background: 'var(--section-bg)' }}>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center mb-6">
                <MapPinIcon className="mr-2" style={{ color: 'var(--accent-color)' }} />
                <h2 className="text-2xl font-bold">Contact</h2>
              </div>
              <Separator className="mb-6" />
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {component.content?.email && (
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4" style={{ background: 'var(--accent-color)' }}>
                          <MailIcon className="h-5 w-5" />
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium mb-1">Email</div>
                          <a 
                            href={`mailto:${component.content.email}`} 
                            className="hover:underline"
                            style={{ color: 'var(--accent-color)' }}
                          >
                            {component.content.email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {component.content?.phone && (
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4" style={{ background: 'var(--accent-color)' }}>
                          <PhoneIcon className="h-5 w-5" />
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium mb-1">Phone</div>
                          <a 
                            href={`tel:${component.content.phone}`} 
                            className="hover:underline"
                            style={{ color: 'var(--accent-color)' }}
                          >
                            {component.content.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {(component.content?.github || component.content?.linkedin || 
                    component.content?.twitter || component.content?.instagram) && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-4">Social Media</h3>
                      <div className="flex flex-wrap gap-4">
                        {component.content?.github && (
                          <Button 
                            variant="outline" 
                            asChild
                            style={{ borderColor: 'var(--primary-color)', color: 'var(--accent-color)' }}
                          >
                            <a href={component.content.github} target="_blank" rel="noopener noreferrer">
                              <GithubIcon className="mr-2 h-4 w-4" />
                              GitHub
                            </a>
                          </Button>
                        )}
                        {component.content?.linkedin && (
                          <Button 
                            variant="outline" 
                            asChild
                            style={{ borderColor: 'var(--primary-color)', color: 'var(--accent-color)' }}
                          >
                            <a href={component.content.linkedin} target="_blank" rel="noopener noreferrer">
                              <LinkedinIcon className="mr-2 h-4 w-4" />
                              LinkedIn
                            </a>
                          </Button>
                        )}
                        {component.content?.twitter && (
                          <Button 
                            variant="outline" 
                            asChild
                            style={{ borderColor: 'var(--primary-color)', color: 'var(--accent-color)' }}
                          >
                            <a href={component.content.twitter} target="_blank" rel="noopener noreferrer">
                              <TwitterIcon className="mr-2 h-4 w-4" />
                              Twitter
                            </a>
                          </Button>
                        )}
                        {component.content?.instagram && (
                          <Button 
                            variant="outline" 
                            asChild
                            style={{ borderColor: 'var(--primary-color)', color: 'var(--accent-color)' }}
                          >
                            <a href={component.content.instagram} target="_blank" rel="noopener noreferrer">
                              <InstagramIcon className="mr-2 h-4 w-4" />
                              Instagram
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {component.content?.additionalInfo && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Additional Information</h3>
                      <p className="whitespace-pre-line">{component.content.additionalInfo}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // Apply CSS variables for the current theme
  const themeStyle = Object.entries(themeVariables).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  return (
    <div 
      className="min-h-screen bg-background"
      style={themeStyle}
    >
      {sortedComponents.map((component, index) => (
        <div key={index}>
          {renderComponent(component)}
        </div>
      ))}
      
      {/* Footer */}
      <footer 
        className="py-8 px-6 text-center"
        style={{ 
          background: 'var(--header-bg)',
          borderTop: '1px solid var(--primary-color)',
          opacity: 0.8 
        }}
      >
        <p className="text-sm">
          © {new Date().getFullYear()} • Created with Portfolio Builder
        </p>
      </footer>
    </div>
  );
}