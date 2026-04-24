import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Checkbox from '@/components/ui/Checkbox';
import Toggle from '@/components/ui/Toggle';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Tabs from '@/components/ui/Tabs';
import Dropdown from '@/components/ui/Dropdown';
import Tooltip from '@/components/ui/Tooltip';
import Skeleton from '@/components/ui/Skeleton';
import { LoadingSpinner, EmptyState, ErrorState } from '@/components/common';
import { VideoCard } from '@/components/video';
import { SettingsItem } from '@/components/ui';
import { Play, Heart, Settings, Search, ChevronDown, Copy, Check, Bell, User, Monitor, Sun, Moon } from 'lucide-react';

// ============ Helper Components ============

const Section = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
    <section className="mb-16">
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">{title}</h2>
            {description && <p className="text-[var(--color-text-secondary)]">{description}</p>}
        </div>
        <div className="space-y-8">{children}</div>
    </section>
);

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">{title}</h3>
        <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
);

const PropsTable = ({ props }: { props: { name: string; type: string; default?: string; description: string }[] }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left py-2 px-3 font-semibold text-[var(--color-text-primary)]">Prop</th>
                    <th className="text-left py-2 px-3 font-semibold text-[var(--color-text-primary)]">Type</th>
                    <th className="text-left py-2 px-3 font-semibold text-[var(--color-text-primary)]">Default</th>
                    <th className="text-left py-2 px-3 font-semibold text-[var(--color-text-primary)]">Description</th>
                </tr>
            </thead>
            <tbody>
                {props.map((prop) => (
                    <tr key={prop.name} className="border-b border-[var(--color-border-default)]/50">
                        <td className="py-2 px-3 font-mono text-[var(--color-accent-primary)]">{prop.name}</td>
                        <td className="py-2 px-3 font-mono text-[var(--color-text-secondary)]">{prop.type}</td>
                        <td className="py-2 px-3 font-mono text-[var(--color-text-tertiary)]">{prop.default || '-'}</td>
                        <td className="py-2 px-3 text-[var(--color-text-secondary)]">{prop.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const CodeBlock = ({ code }: { code: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <pre className="bg-[var(--color-bg-tertiary)] rounded-lg p-4 text-sm font-mono text-[var(--color-text-secondary)] overflow-x-auto">
                <code>{code}</code>
            </pre>
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 rounded bg-[var(--color-bg-secondary)] opacity-0 group-hover:opacity-100 transition-opacity"
            >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
        </div>
    );
};

const Demo = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`p-6 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-default)] ${className}`}>
        {children}
    </div>
);

// ============ Main Component ============

export default function UIKitPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toggleValue, setToggleValue] = useState(false);
    const [checkboxValue, setCheckboxValue] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [activeTab, setActiveTab] = useState('tab1');

    // Only show in development
    if (!import.meta.env.DEV) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-screen">
                    <p className="text-[var(--color-text-secondary)]">
                        UI Kit is only available in development mode.
                    </p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-3">🎨 CURA UI Kit</h1>
                    <p className="text-lg text-[var(--color-text-secondary)] mb-4">
                        Complete design system and component library for CURA
                    </p>
                    <div className="flex gap-2">
                        <Badge>v1.0</Badge>
                        <Badge variant="success">15 Components</Badge>
                    </div>
                </div>

                {/* ============ BUTTON ============ */}
                <Section
                    title="Button"
                    description="Interactive element for triggering actions. Supports multiple variants and sizes."
                >
                    <Demo>
                        <SubSection title="Variants">
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="ghost">Ghost</Button>
                        </SubSection>
                    </Demo>

                    <Demo>
                        <SubSection title="Sizes">
                            <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="lg">Large</Button>
                        </SubSection>
                    </Demo>

                    <Demo>
                        <SubSection title="With Icons">
                            <Button><Play size={16} className="mr-2 fill-current" />Play</Button>
                            <Button variant="secondary"><Heart size={16} className="mr-2" />Like</Button>
                            <Button variant="ghost"><Settings size={16} /></Button>
                        </SubSection>
                    </Demo>

                    <Demo>
                        <SubSection title="States">
                            <Button disabled>Disabled</Button>
                            <Button className="pointer-events-none">
                                <LoadingSpinner size="sm" className="mr-2" />Loading
                            </Button>
                        </SubSection>
                    </Demo>

                    <CodeBlock code={`<Button variant="primary" size="md">Click me</Button>
<Button variant="secondary" disabled>Disabled</Button>
<Button variant="ghost"><Icon /> With Icon</Button>`} />

                    <PropsTable props={[
                        { name: 'variant', type: '"primary" | "secondary" | "ghost"', default: '"primary"', description: 'Visual style of the button' },
                        { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Size of the button' },
                        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button' },
                        { name: 'onClick', type: '() => void', description: 'Click handler function' },
                    ]} />
                </Section>

                {/* ============ INPUT ============ */}
                <Section
                    title="Input"
                    description="Text input field with label, icon, and error state support."
                >
                    <Demo className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Default" placeholder="Enter text..." />
                            <Input label="With Value" value="Hello World" onChange={() => { }} />
                            <Input label="With Icon" placeholder="Search..." icon={<Search size={16} />} />
                            <Input label="Error State" placeholder="Invalid" error="This field is required" />
                            <Input label="Disabled" placeholder="Cannot edit" disabled />
                        </div>
                    </Demo>

                    <CodeBlock code={`<Input 
    label="Email" 
    placeholder="Enter email..." 
    icon={<Mail size={16} />}
    error="Invalid email format"
/>`} />

                    <PropsTable props={[
                        { name: 'label', type: 'string', description: 'Label text above the input' },
                        { name: 'placeholder', type: 'string', description: 'Placeholder text' },
                        { name: 'icon', type: 'ReactNode', description: 'Icon to display inside input' },
                        { name: 'error', type: 'string', description: 'Error message to display' },
                        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input' },
                    ]} />
                </Section>

                {/* ============ TEXTAREA ============ */}
                <Section
                    title="Textarea"
                    description="Multi-line text input for longer content."
                >
                    <Demo>
                        <Textarea label="Description" placeholder="Enter description..." rows={3} />
                    </Demo>

                    <PropsTable props={[
                        { name: 'label', type: 'string', description: 'Label text above the textarea' },
                        { name: 'rows', type: 'number', default: '3', description: 'Number of visible rows' },
                        { name: 'error', type: 'string', description: 'Error message to display' },
                    ]} />
                </Section>

                {/* ============ TOGGLE ============ */}
                <Section
                    title="Toggle"
                    description="On/off switch for boolean settings."
                >
                    <Demo>
                        <SubSection title="States">
                            <Toggle checked={false} onChange={() => { }} label="Off" />
                            <Toggle checked={true} onChange={() => { }} label="On" />
                            <Toggle checked={toggleValue} onChange={setToggleValue} label="Interactive" />
                        </SubSection>
                    </Demo>

                    <CodeBlock code={`const [enabled, setEnabled] = useState(false);
<Toggle checked={enabled} onChange={setEnabled} label="Notifications" />`} />

                    <PropsTable props={[
                        { name: 'checked', type: 'boolean', description: 'Current state of the toggle' },
                        { name: 'onChange', type: '(checked: boolean) => void', description: 'Change handler' },
                        { name: 'label', type: 'string', description: 'Label text next to toggle' },
                    ]} />
                </Section>

                {/* ============ CHECKBOX ============ */}
                <Section
                    title="Checkbox"
                    description="Checkable input for multiple selections. Supports component style and native accent style."
                >
                    <Demo>
                        <SubSection title="Component Style">
                            <Checkbox checked={false} onChange={() => { }} label="Unchecked" />
                            <Checkbox checked={checkboxValue} onChange={setCheckboxValue} label="Interactive" />
                        </SubSection>
                    </Demo>

                    <Demo>
                        <SubSection title="Settings Style (Native Accent)">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={checkboxValue}
                                    onChange={(e) => setCheckboxValue(e.target.checked)}
                                    className="w-5 h-5 rounded accent-[var(--color-accent-primary)] cursor-pointer"
                                />
                                <span className="text-sm text-[var(--color-text-primary)]">Accent styled native checkbox</span>
                            </div>
                        </SubSection>
                    </Demo>

                    <PropsTable props={[
                        { name: 'checked', type: 'boolean', description: 'Current checked state' },
                        { name: 'onChange', type: '(checked: boolean) => void', description: 'Change handler' },
                        { name: 'label', type: 'string', description: 'Label text next to checkbox' },
                    ]} />
                </Section>

                {/* ============ PATTERNS & LAYOUTS ============ */}
                <Section
                    title="Patterns & Layouts"
                    description="Commonly used component combinations and layouts found across the app."
                >
                    <SubSection title="Settings Items">
                        <div className="w-full space-y-3">
                            <SettingsItem
                                title="Notifications"
                                description="Receive alerts when new videos are added."
                                icon={<Bell size={20} />}
                            >
                                <Toggle checked={toggleValue} onChange={setToggleValue} />
                            </SettingsItem>

                            <SettingsItem
                                title="Dark Mode"
                                description="Switch between light and dark themes."
                                icon={<Moon size={20} />}
                            >
                                <Button size="sm" variant="secondary">Change</Button>
                            </SettingsItem>

                            <SettingsItem
                                title="Email Alerts"
                                description="Get weekly summaries of your collections."
                                icon={<User size={20} />}
                            >
                                <input
                                    type="checkbox"
                                    checked={checkboxValue}
                                    onChange={(e) => setCheckboxValue(e.target.checked)}
                                    className="w-5 h-5 rounded accent-[var(--color-accent-primary)] cursor-pointer"
                                />
                            </SettingsItem>
                        </div>
                    </SubSection>

                    <SubSection title="Action Buttons (Play Style)">
                        <div className="flex gap-4">
                            <Button size="lg" className="rounded-full w-14 h-14 p-0 flex items-center justify-center">
                                <Play size={24} className="fill-current ml-1" />
                            </Button>
                            <Button size="md" className="rounded-full w-12 h-12 p-0 flex items-center justify-center">
                                <Play size={20} className="fill-current ml-1" />
                            </Button>
                            <Button variant="secondary" className="rounded-full px-6">
                                <Play size={16} className="mr-2 fill-current" /> Play All
                            </Button>
                        </div>
                    </SubSection>
                </Section>

                {/* ============ BADGE ============ */}
                <Section
                    title="Badge"
                    description="Small labels for status, categories, and metadata."
                >
                    <Demo>
                        <SubSection title="Variants">
                            <Badge>Default</Badge>
                            <Badge variant="success">Success</Badge>
                            <Badge variant="warning">Warning</Badge>
                            <Badge variant="error">Error</Badge>
                        </SubSection>
                    </Demo>

                    <Demo>
                        <SubSection title="Video Categories">
                            <Badge variant="category" category="MV">MV</Badge>
                            <Badge variant="category" category="LIVE">LIVE</Badge>
                            <Badge variant="category" category="FANCAM">FANCAM</Badge>
                            <Badge variant="category" category="BEHIND">BEHIND</Badge>
                            <Badge variant="category" category="SHORTS">SHORTS</Badge>
                        </SubSection>
                    </Demo>

                    <PropsTable props={[
                        { name: 'variant', type: '"default" | "success" | "warning" | "error" | "category"', default: '"default"', description: 'Visual style' },
                        { name: 'category', type: '"MV" | "LIVE" | "FANCAM" | "BEHIND" | "SHORTS"', description: 'Video category (when variant="category")' },
                    ]} />
                </Section>

                {/* ============ AVATAR ============ */}
                <Section
                    title="Avatar"
                    description="User profile image with fallback initials."
                >
                    <Demo>
                        <SubSection title="Sizes">
                            <Avatar size="sm" alt="John" />
                            <Avatar size="md" alt="Jane" />
                            <Avatar size="lg" alt="Bob" />
                            <Avatar size="xl" alt="Kate" />
                        </SubSection>
                    </Demo>

                    <Demo>
                        <SubSection title="With Image">
                            <Avatar size="lg" src="https://i.pravatar.cc/150?img=1" alt="User 1" />
                            <Avatar size="lg" src="https://i.pravatar.cc/150?img=2" alt="User 2" />
                            <Avatar size="lg" src="https://i.pravatar.cc/150?img=3" alt="User 3" />
                        </SubSection>
                    </Demo>

                    <PropsTable props={[
                        { name: 'src', type: 'string', description: 'Image URL' },
                        { name: 'alt', type: 'string', description: 'Alt text, first letter used as fallback' },
                        { name: 'size', type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: 'Avatar size' },
                        { name: 'fallback', type: 'string', description: 'Custom fallback text instead of alt initial' },
                    ]} />
                </Section>

                {/* ============ CARD ============ */}
                <Section
                    title="Card"
                    description="Container for grouping related content."
                >
                    <Demo>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <h3 className="font-semibold mb-2">Default Card</h3>
                                <p className="text-sm text-[var(--color-text-secondary)]">Basic card with content.</p>
                            </Card>
                            <Card variant="hoverable">
                                <h3 className="font-semibold mb-2">Hoverable</h3>
                                <p className="text-sm text-[var(--color-text-secondary)]">Hover to see effect.</p>
                            </Card>
                            <Card variant="clickable">
                                <h3 className="font-semibold mb-2">Clickable</h3>
                                <p className="text-sm text-[var(--color-text-secondary)]">Interactive card.</p>
                            </Card>
                        </div>
                    </Demo>

                    <PropsTable props={[
                        { name: 'variant', type: '"default" | "hoverable" | "clickable"', default: '"default"', description: 'Card interaction style' },
                        { name: 'padding', type: '"none" | "sm" | "md" | "lg"', default: '"md"', description: 'Internal padding' },
                    ]} />
                </Section>

                {/* ============ TABS ============ */}
                <Section
                    title="Tabs"
                    description="Navigation between different views or sections."
                >
                    <Demo>
                        <Tabs
                            tabs={[
                                { id: 'tab1', label: 'Overview' },
                                { id: 'tab2', label: 'Settings' },
                                { id: 'tab3', label: 'Advanced' },
                            ]}
                            activeTab={activeTab}
                            onChange={setActiveTab}
                        />
                        <div className="mt-4 p-4 bg-[var(--color-bg-tertiary)] rounded-lg">
                            Active tab: <strong>{activeTab}</strong>
                        </div>
                    </Demo>

                    <PropsTable props={[
                        { name: 'tabs', type: '{ id: string; label: string }[]', description: 'Array of tab definitions' },
                        { name: 'activeTab', type: 'string', description: 'Currently active tab ID' },
                        { name: 'onChange', type: '(tabId: string) => void', description: 'Tab change handler' },
                    ]} />
                </Section>

                {/* ============ MODAL ============ */}
                <Section
                    title="Modal"
                    description="Overlay dialog for focused interactions."
                >
                    <Demo>
                        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                        <Modal
                            open={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            title="Example Modal"
                            size="md"
                        >
                            <p className="text-[var(--color-text-secondary)] mb-4">
                                This is the modal content. You can put any content here.
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
                            </div>
                        </Modal>
                    </Demo>

                    <PropsTable props={[
                        { name: 'open', type: 'boolean', description: 'Controls modal visibility' },
                        { name: 'onClose', type: '() => void', description: 'Called when modal should close' },
                        { name: 'title', type: 'string', description: 'Modal header title' },
                        { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Modal width' },
                    ]} />
                </Section>

                {/* ============ DROPDOWN ============ */}
                <Section
                    title="Dropdown"
                    description="Menu that appears on trigger click."
                >
                    <Demo>
                        <Dropdown
                            trigger={
                                <Button variant="secondary">
                                    Menu <ChevronDown size={14} className="ml-2" />
                                </Button>
                            }
                            items={[
                                { label: 'Edit', onClick: () => console.log('Edit') },
                                { label: 'Duplicate', onClick: () => console.log('Duplicate') },
                                { label: 'Delete', onClick: () => console.log('Delete') },
                            ]}
                        />
                    </Demo>

                    <PropsTable props={[
                        { name: 'trigger', type: 'ReactNode', description: 'Element that triggers dropdown' },
                        { name: 'items', type: '{ label: string; onClick: () => void }[]', description: 'Menu items' },
                    ]} />
                </Section>

                {/* ============ TOOLTIP ============ */}
                <Section
                    title="Tooltip"
                    description="Contextual information on hover."
                >
                    <Demo>
                        <SubSection title="Positions">
                            <Tooltip content="Top tooltip" position="top">
                                <Button variant="secondary" size="sm">Top</Button>
                            </Tooltip>
                            <Tooltip content="Bottom tooltip" position="bottom">
                                <Button variant="secondary" size="sm">Bottom</Button>
                            </Tooltip>
                            <Tooltip content="Left tooltip" position="left">
                                <Button variant="secondary" size="sm">Left</Button>
                            </Tooltip>
                            <Tooltip content="Right tooltip" position="right">
                                <Button variant="secondary" size="sm">Right</Button>
                            </Tooltip>
                        </SubSection>
                    </Demo>

                    <PropsTable props={[
                        { name: 'content', type: 'string', description: 'Tooltip text' },
                        { name: 'position', type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: 'Tooltip position' },
                        { name: 'children', type: 'ReactNode', description: 'Trigger element' },
                    ]} />
                </Section>

                {/* ============ LOADING STATES ============ */}
                <Section
                    title="Loading States"
                    description="Visual indicators for loading and placeholder content."
                >
                    <Demo>
                        <SubSection title="Spinners">
                            <LoadingSpinner size="sm" />
                            <LoadingSpinner size="md" />
                            <LoadingSpinner size="lg" />
                        </SubSection>
                    </Demo>

                    <Demo>
                        <SubSection title="Skeletons">
                            <Skeleton className="w-32 h-4 rounded" />
                            <Skeleton className="w-20 h-20 rounded-full" />
                            <Skeleton className="w-48 h-24 rounded-lg" />
                        </SubSection>
                    </Demo>

                    <PropsTable props={[
                        { name: 'size (Spinner)', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Spinner size' },
                        { name: 'className (Skeleton)', type: 'string', description: 'Custom class for sizing/shape' },
                    ]} />
                </Section>

                {/* ============ EMPTY/ERROR STATES ============ */}
                <Section
                    title="Empty & Error States"
                    description="Feedback components for empty data or errors."
                >
                    <Demo className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-[var(--color-bg-tertiary)] rounded-lg">
                            <EmptyState
                                title="No videos found"
                                description="Add your first video to get started."
                                action={<Button size="sm">Add Video</Button>}
                            />
                        </div>
                        <div className="p-6 bg-[var(--color-bg-tertiary)] rounded-lg">
                            <ErrorState
                                title="Something went wrong"
                                message="Failed to load data."
                                onRetry={() => console.log('Retry')}
                            />
                        </div>
                    </Demo>
                </Section>

                {/* ============ VIDEO CARD ============ */}
                <Section
                    title="VideoCard"
                    description="Card component for displaying video thumbnails and metadata."
                >
                    <Demo>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <VideoCard
                                video={{
                                    id: 1,
                                    youtubeVideoId: 'dQw4w9WgXcQ',
                                    title: 'Example Video Title',
                                    channelName: 'Channel Name',
                                    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                                    durationSeconds: 212,
                                    publishedAt: '2024-01-01',
                                    category: 'MV',
                                    collectionId: 1,
                                }}
                                onClick={() => { }}
                            />
                        </div>
                    </Demo>

                    <PropsTable props={[
                        { name: 'video', type: 'Video', description: 'Video object with metadata' },
                        { name: 'onClick', type: '() => void', description: 'Click handler' },
                        { name: 'showProgress', type: 'boolean', default: 'false', description: 'Show watch progress bar' },
                    ]} />
                </Section>

            </div>
        </MainLayout>
    );
}
