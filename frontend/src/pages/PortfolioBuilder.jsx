import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GripVertical, Save, CheckCircle, XCircle } from 'lucide-react';
import PortfolioPreview from '@/components/PortfolioPreview';
import { portfolioThemes } from '@/lib/themes';

const ComponentTypes = {
  HEADER: 'header',
  ABOUT: 'about',
  EDUCATION: 'education',
  EXPERIENCE: 'experience',
  SKILLS: 'skills',
  PROJECTS: 'projects',
  ACHIEVEMENTS: 'achievements',
  CONTACT: 'contact',
};

// Custom Alert component
const CustomAlert = ({ variant = "default", title, message, onClose, visible }) => {
  if (!visible) return null;

  return (
    <Alert variant={variant} className="mb-6 animate-in fade-in slide-in-from-top-5 duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {variant === "destructive" ? (
            <XCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertTitle>{title}</AlertTitle>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
            <XCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
      <AlertDescription className="mt-1">{message}</AlertDescription>
    </Alert>
  );
};

// Component for the palette items
const DraggableComponent = ({ type, onDrop, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'componentPalette',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-4 border rounded-md cursor-move ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onDrop(type)}
    >
      {children}
    </div>
  );
};

// Reorderable component implementation
const ReorderableComponent = ({ id, index, component, onMoveComponent, onClick, onRemove, isSelected, children }) => {
  // Setup drag functionality
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'componentCanvas',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Setup drop functionality
  const [, drop] = useDrop(() => ({
    accept: 'componentCanvas',
    hover: (item, monitor) => {
      if (item.index !== index) {
        onMoveComponent(item.index, index);
        // Update the item's index to match its new position
        item.index = index;
      }
    },
  }));

  // Combine drag and drop refs
  const combineRefs = (el) => {
    drag(el);
    drop(el);
  };

  return (
    <Card
      ref={combineRefs}
      className={`cursor-pointer mb-4 ${isSelected ? 'ring-2 ring-primary' : ''} ${isDragging ? 'opacity-50' : ''
        }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center">
              <GripVertical className="mr-2 cursor-move text-muted-foreground" />
              <h3 className="font-medium">{component.type}</h3>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              Remove
            </Button>
          </div>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

const ComponentEditor = ({ type, content = {}, onChange }) => {
  switch (type) {
    case ComponentTypes.HEADER:
      return (
        <div className="space-y-4">
          <Input
            placeholder="Title"
            value={content?.title || ''}
            onChange={(e) => onChange({ ...content, title: e.target.value })}
          />
          <Input
            placeholder="Subtitle"
            value={content?.subtitle || ''}
            onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
          />
        </div>
      );
    case ComponentTypes.ABOUT:
      return (
        <Textarea
          placeholder="About me..."
          value={content?.text || ''}
          onChange={(e) => onChange({ ...content, text: e.target.value })}
        />
      );
    case ComponentTypes.SKILLS:
      return (
        <div className="space-y-4">
          <Input
            placeholder="Add skill (press Enter)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const skills = content?.skills || [];
                onChange({ ...content, skills: [...skills, e.target.value] });
                e.target.value = '';
              }
            }}
          />
          <div className="flex flex-wrap gap-2">
            {(content?.skills || []).map((skill, index) => (
              <div key={index} className="px-3 py-1 bg-primary/10 rounded-full">
                {skill}
              </div>
            ))}
          </div>
        </div>
      );
    case ComponentTypes.PROJECTS:
      return (
        <div className="space-y-4">
          <Input
            placeholder="Project Title"
            value={content?.projectTitle || ''}
            onChange={(e) => onChange({ ...content, projectTitle: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="GitHub Repository URL"
              type="url"
              value={content?.githubUrl || ''}
              onChange={(e) => onChange({ ...content, githubUrl: e.target.value })}
            />
            <Input
              placeholder="Live Demo URL"
              type="url"
              value={content?.demoUrl || ''}
              onChange={(e) => onChange({ ...content, demoUrl: e.target.value })}
            />
          </div>
          <Input
            placeholder="Duration (e.g., 'Jan 2023 - Mar 2023')"
            value={content?.duration || ''}
            onChange={(e) => onChange({ ...content, duration: e.target.value })}
          />
          <Textarea
            placeholder="Project Description"
            value={content?.projectDescription || ''}
            onChange={(e) => onChange({ ...content, projectDescription: e.target.value })}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Tech Stack</label>
            <Input
              placeholder="Add technology (press Enter)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const techStack = content?.techStack || [];
                  onChange({ ...content, techStack: [...techStack, e.target.value] });
                  e.target.value = '';
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {(content?.techStack || []).map((tech, index) => (
                <div key={index} className="px-3 py-1 bg-primary/10 rounded-full">
                  {tech}
                </div>
              ))}
            </div>
          </div>
          <Textarea
            placeholder="Key Features (one per line)"
            value={content?.features || ''}
            onChange={(e) => onChange({ ...content, features: e.target.value })}
          />
          <Textarea
            placeholder="Challenges & Solutions"
            value={content?.challenges || ''}
            onChange={(e) => onChange({ ...content, challenges: e.target.value })}
          />
        </div>
      );
    case ComponentTypes.EDUCATION:
      return (
        <div className="space-y-4">
          <Input
            placeholder="Institution Name"
            value={content?.institution || ''}
            onChange={(e) => onChange({ ...content, institution: e.target.value })}
          />
          <Input
            placeholder="Degree/Certificate"
            value={content?.degree || ''}
            onChange={(e) => onChange({ ...content, degree: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Start Date"
              value={content?.startDate || ''}
              onChange={(e) => onChange({ ...content, startDate: e.target.value })}
            />
            <Input
              placeholder="End Date"
              value={content?.endDate || ''}
              onChange={(e) => onChange({ ...content, endDate: e.target.value })}
            />
          </div>
          <Textarea
            placeholder="Description"
            value={content?.description || ''}
            onChange={(e) => onChange({ ...content, description: e.target.value })}
          />
        </div>
      );
    case ComponentTypes.EXPERIENCE:
      return (
        <div className="space-y-4">
          <Input
            placeholder="Company/Organization"
            value={content?.company || ''}
            onChange={(e) => onChange({ ...content, company: e.target.value })}
          />
          <Input
            placeholder="Position"
            value={content?.position || ''}
            onChange={(e) => onChange({ ...content, position: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Start Date"
              value={content?.startDate || ''}
              onChange={(e) => onChange({ ...content, startDate: e.target.value })}
            />
            <Input
              placeholder="End Date"
              value={content?.endDate || ''}
              onChange={(e) => onChange({ ...content, endDate: e.target.value })}
            />
          </div>
          <Textarea
            placeholder="Description"
            value={content?.description || ''}
            onChange={(e) => onChange({ ...content, description: e.target.value })}
          />
        </div>
      );
    case ComponentTypes.CONTACT:
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Email"
              type="email"
              value={content?.email || ''}
              onChange={(e) => onChange({ ...content, email: e.target.value })}
            />
            <Input
              placeholder="Phone"
              type="tel"
              value={content?.phone || ''}
              onChange={(e) => onChange({ ...content, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Social Media</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="GitHub Profile URL"
                type="url"
                value={content?.github || ''}
                onChange={(e) => onChange({ ...content, github: e.target.value })}
              />
              <Input
                placeholder="LinkedIn Profile URL"
                type="url"
                value={content?.linkedin || ''}
                onChange={(e) => onChange({ ...content, linkedin: e.target.value })}
              />
              <Input
                placeholder="Twitter/X Profile URL"
                type="url"
                value={content?.twitter || ''}
                onChange={(e) => onChange({ ...content, twitter: e.target.value })}
              />
              <Input
                placeholder="Instagram Profile URL"
                type="url"
                value={content?.instagram || ''}
                onChange={(e) => onChange({ ...content, instagram: e.target.value })}
              />
            </div>
          </div>
          <Textarea
            placeholder="Additional Contact Information or Message"
            value={content?.additionalInfo || ''}
            onChange={(e) => onChange({ ...content, additionalInfo: e.target.value })}
          />
        </div>
      );
    case ComponentTypes.ACHIEVEMENTS:
      return (
        <div className="space-y-4">
          <Input
            placeholder="Achievement Title"
            value={content?.title || ''}
            onChange={(e) => onChange({ ...content, title: e.target.value })}
          />
          <Input
            placeholder="Year"
            type="number"
            value={content?.year || ''}
            onChange={(e) => onChange({ ...content, year: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={content?.description || ''}
            onChange={(e) => onChange({ ...content, description: e.target.value })}
          />
        </div>
      );
    default:
      return null;
  }
};

export default function PortfolioBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { portfolio, isLoading, error, updatePortfolio } = usePortfolio(id);
  
  // Local state for editing
  const [localPortfolio, setLocalPortfolio] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [publishSlug, setPublishSlug] = useState('');
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Alert state
  const [alert, setAlert] = useState({
    visible: false,
    variant: "default",
    title: "",
    message: ""
  });

  // Show alert helper function
  const showAlert = (variant, title, message) => {
    setAlert({
      visible: true,
      variant,
      title,
      message
    });
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setAlert(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  // Initialize local state with portfolio data
  useEffect(() => {
    if (portfolio && !localPortfolio) {
      setLocalPortfolio({
        ...portfolio,
        theme: portfolio.theme || 'classic',
      });
    }
  }, [portfolio, localPortfolio]);
  
  // Handle adding a new component from the palette
  const handleDrop = useCallback((type) => {
    const newComponent = {
      type,
      content: {},
      order: localPortfolio?.components?.length || 0,
    };

    setLocalPortfolio(prev => ({
      ...prev,
      components: [...(prev?.components || []), newComponent]
    }));
    
    setHasUnsavedChanges(true);
  }, [localPortfolio]);

  // Handle updating a component's content
  const handleComponentUpdate = useCallback((index, content) => {
    if (!localPortfolio?.components) return;
    
    const newComponents = [...localPortfolio.components];
    newComponents[index] = { ...newComponents[index], content };

    setLocalPortfolio(prev => ({
      ...prev,
      components: newComponents
    }));
    
    setHasUnsavedChanges(true);
  }, [localPortfolio]);

  // Handle reordering of components
  const moveComponent = useCallback((fromIndex, toIndex) => {
    if (!localPortfolio?.components) return;

    const newComponents = [...localPortfolio.components];
    const [movedComponent] = newComponents.splice(fromIndex, 1);
    newComponents.splice(toIndex, 0, movedComponent);

    // Update the order property for each component
    const updatedComponents = newComponents.map((component, index) => ({
      ...component,
      order: index
    }));

    setLocalPortfolio(prev => ({
      ...prev,
      components: updatedComponents
    }));
    
    // Update selected component index if it was moved
    if (selectedComponent === fromIndex) {
      setSelectedComponent(toIndex);
    } else if (selectedComponent > fromIndex && selectedComponent <= toIndex) {
      setSelectedComponent(selectedComponent - 1);
    } else if (selectedComponent < fromIndex && selectedComponent >= toIndex) {
      setSelectedComponent(selectedComponent + 1);
    }
    
    setHasUnsavedChanges(true);
  }, [localPortfolio, selectedComponent]);

  // Handle removing a component
  const handleRemoveComponent = useCallback((index) => {
    if (!localPortfolio?.components) return;
    
    const newComponents = localPortfolio.components.filter((_, i) => i !== index);

    // Update the order property for each component
    const updatedComponents = newComponents.map((component, idx) => ({
      ...component,
      order: idx
    }));

    setLocalPortfolio(prev => ({
      ...prev,
      components: updatedComponents
    }));

    if (selectedComponent === index) {
      setSelectedComponent(null);
    } else if (selectedComponent > index) {
      setSelectedComponent(selectedComponent - 1);
    }
    
    setHasUnsavedChanges(true);
  }, [localPortfolio, selectedComponent]);

  // Handle updating portfolio title or slug
  const handlePortfolioUpdate = (field, value) => {
    setLocalPortfolio(prev => ({
      ...prev,
      [field]: value
    }));
    
    setHasUnsavedChanges(true);
  };
  
  // Handle updating theme
  const handleThemeUpdate = (themeId) => {
    setLocalPortfolio(prev => ({
      ...prev,
      theme: themeId
    }));
    
    setHasUnsavedChanges(true);
  };

  // Save changes to the database
  const handleSaveChanges = async () => {
    try {
      await updatePortfolio.mutateAsync({
        title: localPortfolio.title,
        slug: localPortfolio.slug,
        theme: localPortfolio.theme,
        components: localPortfolio.components
      });
      
      setHasUnsavedChanges(false);
      showAlert(
        "default", 
        "Changes saved", 
        "Your portfolio has been updated successfully."
      );
    } catch (error) {
      showAlert(
        "destructive", 
        "Failed to save changes", 
        error.message || "An error occurred while saving changes."
      );
    }
  };

  const handlePublish = async () => {
    try {
      if (!localPortfolio.slug && !publishSlug) {
        throw new Error('Portfolio URL is required');
      }

      // Save any unsaved changes first
      if (hasUnsavedChanges) {
        await handleSaveChanges();
      }

      // Send only the required fields for publishing
      const updates = {
        isPublished: true,
        slug: publishSlug || localPortfolio.slug,
      };

      await updatePortfolio.mutateAsync(updates);
      setPublishDialogOpen(false);
      showAlert(
        "default", 
        "Portfolio published!", 
        `Your portfolio is now available at /portfolio/${updates.slug}`
      );
    } catch (error) {
      showAlert(
        "destructive", 
        "Failed to publish", 
        error.message || "An error occurred while publishing your portfolio."
      );
    }
  };

  if (isLoading) return <div className="container flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="container flex justify-center items-center min-h-screen">Error: {error.message}</div>;
  if (!localPortfolio) return <div className="container flex justify-center items-center min-h-screen">Loading portfolio data...</div>;

  return (
    <div className="container py-4 sm:py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">{localPortfolio?.title || 'Portfolio Builder'}</h1>
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            <Button variant="outline" onClick={() => navigate('/profile')} className="flex-grow sm:flex-grow-0">
              Back
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex-grow sm:flex-grow-0">Preview</Button>
              </DialogTrigger>
              <DialogContent className="max-w-full sm:max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Portfolio Preview</DialogTitle>
                </DialogHeader>
                <div className="h-96 overflow-y-auto">
                  <PortfolioPreview 
                    components={localPortfolio?.components || []} 
                    theme={localPortfolio?.theme}
                  />
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="default"
              onClick={handleSaveChanges}
              disabled={updatePortfolio.isLoading || !hasUnsavedChanges}
              className="gap-2 flex-grow sm:flex-grow-0"
            >
              <Save size={16} />
              Save
            </Button>
            <Button
              variant="default"
              onClick={() => setPublishDialogOpen(true)}
              className="flex-grow sm:flex-grow-0"
            >
              Publish
            </Button>
          </div>
        </div>

        <CustomAlert 
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
          visible={alert.visible}
          onClose={() => setAlert(prev => ({ ...prev, visible: false }))}
        />

        {hasUnsavedChanges && (
          <Alert className="mb-6" variant="warning">
            <AlertTitle>Unsaved Changes</AlertTitle>
            <AlertDescription>
              You have unsaved changes. Click "Save" to save them before publishing.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 lg:order-1 order-2">
            <Tabs defaultValue="components" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="components" className="flex-1">Components</TabsTrigger>
                <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="components" className="mt-4">
                <div className="space-y-4">
                  {Object.entries(ComponentTypes).map(([key, type]) => (
                    <DraggableComponent key={key} type={type} onDrop={handleDrop}>
                      <h3 className="font-medium">{key} Section</h3>
                      <p className="text-sm text-muted-foreground">Drag to add</p>
                    </DraggableComponent>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="settings">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="portfolio-title" className="text-sm font-medium">
                      Portfolio Title
                    </label>
                    <Input
                      id="portfolio-title"
                      value={localPortfolio?.title || ''}
                      onChange={(e) => handlePortfolioUpdate('title', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="portfolio-slug" className="text-sm font-medium">
                      Portfolio URL
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        /portfolio/
                      </span>
                      <Input
                        id="portfolio-slug"
                        value={localPortfolio?.slug || ''}
                        onChange={(e) => {
                          const newSlug = e.target.value.toLowerCase().replace(/\s+/g, '-');
                          handlePortfolioUpdate('slug', newSlug);
                        }}
                        placeholder="custom-url"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Current URL: {portfolio?.slug ? (
                        <a
                          href={`/portfolio/${portfolio.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          /portfolio/{portfolio.slug}
                        </a>
                      ) : 'Not set'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Theme</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.values(portfolioThemes).map((theme) => (
                        <div
                          key={theme.id}
                          className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${localPortfolio?.theme === theme.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                            }`}
                          onClick={() => handleThemeUpdate(theme.id)}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{theme.name}</h3>
                              {localPortfolio?.theme === theme.id && (
                                <div className="text-primary">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {theme.description}
                            </p>
                            {theme.preview && (
                              <div className="mt-2 grid grid-cols-5 gap-1 h-8 rounded-md overflow-hidden">
                                {Object.entries(theme.preview).map(([key, color]) => (
                                  <div
                                    key={key}
                                    className="h-full"
                                    style={{ backgroundColor: color }}
                                    title={key}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-8 lg:order-2 order-1">
            <div>
              {localPortfolio?.components?.length === 0 ? (
                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    Add components from the palette to build your portfolio.
                  </p>
                </div>
              ) : (
                localPortfolio?.components?.map((component, index) => (
                  <ReorderableComponent
                    key={`component-${index}`}
                    id={`component-${index}`}
                    index={index}
                    component={component}
                    onMoveComponent={moveComponent}
                    onClick={() => setSelectedComponent(index)}
                    onRemove={() => handleRemoveComponent(index)}
                    isSelected={selectedComponent === index}
                  >
                    <ComponentEditor
                      type={component.type}
                      content={component.content}
                      onChange={(content) => handleComponentUpdate(index, content)}
                    />
                  </ReorderableComponent>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Publish Portfolio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="publish-slug" className="text-sm font-medium">Portfolio URL</label>
              <div className="flex items-center space-x-2 mt-1.5">
                <span className="text-sm text-muted-foreground">
                  /portfolio/
                </span>
                <Input
                  id="publish-slug"
                  value={publishSlug || localPortfolio?.slug || ''}
                  onChange={(e) => setPublishSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="your-portfolio-url"
                  required
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This URL will be used to access your published portfolio.
              </p>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handlePublish}
                disabled={updatePortfolio.isLoading || (!publishSlug && !localPortfolio?.slug)}
              >{updatePortfolio.isLoading ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile component list view toggle for smaller screens */}
      <div className="fixed bottom-4 right-4 lg:hidden z-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg h-14 w-14 p-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 3v18" />
                <path d="M3 9h6" />
                <path d="M3 15h6" />
                <path d="M15 3v18" />
                <path d="M15 9h6" />
                <path d="M15 15h6" />
              </svg>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[90vw] max-w-md">
            <DialogHeader>
              <DialogTitle>Add Components</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {Object.entries(ComponentTypes).map(([key, type]) => (
                <div 
                  key={key} 
                  className="p-4 border rounded-md cursor-pointer hover:bg-accent"
                  onClick={() => {
                    handleDrop(type);
                    document.querySelector('[data-radix-dialog-close]').click();
                  }}
                >
                  <h3 className="font-medium">{key} Section</h3>
                  <p className="text-sm text-muted-foreground">Tap to add</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}