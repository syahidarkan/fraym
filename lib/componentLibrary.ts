// Component Library - 100+ Wireframe Components
import { LucideIcon, Square, Circle, Type, MousePointer2, CreditCard, Image as ImageIcon, Navigation, Menu, LayoutGrid, Container, Grid3x3, AlignJustify, List, Table2, BarChart3, Users, Mail, Phone, MapPin, Search, Calendar, Clock, Star, Heart, X, Check, ChevronDown, Settings, User, Lock, Eye, Upload, Download, Share2, Bell, MessageSquare, Home, Info, FileText, Sliders, Palette, Loader, Zap, TrendingUp, Grid, Columns, Binary, Hash, MessageCircle, Bot, Plus } from 'lucide-react'

export interface ComponentCategory {
    id: string
    name: string
    icon: LucideIcon
    components: ComponentTemplate[]
}

export interface ComponentTemplate {
    id: string
    name: string
    type: string
    category: string
    icon: LucideIcon
    defaultProps: {
        width: number
        height: number
        x: number
        y: number
        type: string
        content?: string
        style?: Record<string, any>
    }
    description: string
}

export const componentCategories: ComponentCategory[] = [
    {
        id: 'basic',
        name: 'Basic Shapes',
        icon: Square,
        components: [
            {
                id: 'rectangle',
                name: 'Rectangle',
                type: 'rectangle',
                category: 'basic',
                icon: Square,
                defaultProps: {
                    width: 150,
                    height: 100,
                    x: 100,
                    y: 100,
                    type: 'rectangle'
                },
                description: 'Basic rectangle shape'
            },
            {
                id: 'circle',
                name: 'Circle',
                type: 'circle',
                category: 'basic',
                icon: Circle,
                defaultProps: {
                    width: 100,
                    height: 100,
                    x: 100,
                    y: 100,
                    type: 'circle'
                },
                description: 'Basic circle shape'
            },
            {
                id: 'text',
                name: 'Text',
                type: 'text',
                category: 'basic',
                icon: Type,
                defaultProps: {
                    width: 150,
                    height: 40,
                    x: 100,
                    y: 100,
                    type: 'text',
                    content: 'Text Label'
                },
                description: 'Text label'
            },
            {
                id: 'heading',
                name: 'Heading',
                type: 'heading',
                category: 'basic',
                icon: Type,
                defaultProps: {
                    width: 300,
                    height: 50,
                    x: 100,
                    y: 100,
                    type: 'heading',
                    content: 'HEADING',
                    style: { fontSize: '24px', fontWeight: 'bold' }
                },
                description: 'Large heading text'
            },
            {
                id: 'container',
                name: 'Container',
                type: 'container',
                category: 'basic',
                icon: Container,
                defaultProps: {
                    width: 300,
                    height: 200,
                    x: 100,
                    y: 100,
                    type: 'container'
                },
                description: 'Container box'
            }
        ]
    },
    {
        id: 'navigation',
        name: 'Navigation',
        icon: Menu,
        components: [
            {
                id: 'navbar',
                name: 'Navbar',
                type: 'navbar',
                category: 'navigation',
                icon: Navigation,
                defaultProps: {
                    width: 1200,
                    height: 70,
                    x: 0,
                    y: 0,
                    type: 'navbar',
                    content: 'LOGO | MENU | MENU | MENU | [LOGIN]'
                },
                description: 'Top navigation bar'
            },
            {
                id: 'sidebar',
                name: 'Sidebar',
                type: 'sidebar',
                category: 'navigation',
                icon: AlignJustify,
                defaultProps: {
                    width: 250,
                    height: 800,
                    x: 0,
                    y: 0,
                    type: 'sidebar',
                    content: 'Dashboard\\nProjects\\nSettings\\nProfile'
                },
                description: 'Side navigation panel'
            },
            {
                id: 'breadcrumb',
                name: 'Breadcrumb',
                type: 'breadcrumb',
                category: 'navigation',
                icon: ChevronDown,
                defaultProps: {
                    width: 300,
                    height: 30,
                    x: 100,
                    y: 100,
                    type: 'breadcrumb',
                    content: 'Home > Category > Page'
                },
                description: 'Breadcrumb trail'
            },
            {
                id: 'tabs',
                name: 'Tabs',
                type: 'tabs',
                category: 'navigation',
                icon: Menu,
                defaultProps: {
                    width: 400,
                    height: 50,
                    x: 100,
                    y: 100,
                    type: 'tabs',
                    content: '[Tab 1] Tab 2 Tab 3'
                },
                description: 'Tab navigation'
            },
            {
                id: 'pagination',
                name: 'Pagination',
                type: 'pagination',
                category: 'navigation',
                icon: ChevronDown,
                defaultProps: {
                    width: 200,
                    height: 40,
                    x: 100,
                    y: 100,
                    type: 'pagination',
                    content: '< 1 [2] 3 >'
                },
                description: 'Page navigation'
            },
            {
                id: 'footer',
                name: 'Footer',
                type: 'footer',
                category: 'navigation',
                icon: AlignJustify,
                defaultProps: {
                    width: 1200,
                    height: 200,
                    x: 0,
                    y: 900,
                    type: 'footer',
                    content: 'Company | About | Contact | © 2024'
                },
                description: 'Footer section'
            }
        ]
    },
    {
        id: 'forms',
        name: 'Form Elements',
        icon: FileText,
        components: [
            {
                id: 'input',
                name: 'Input Field',
                type: 'input',
                category: 'forms',
                icon: Type,
                defaultProps: {
                    width: 250,
                    height: 40,
                    x: 100,
                    y: 100,
                    type: 'input',
                    content: 'Input field'
                },
                description: 'Text input'
            },
            {
                id: 'textarea',
                name: 'Textarea',
                type: 'textarea',
                category: 'forms',
                icon: AlignJustify,
                defaultProps: {
                    width: 300,
                    height: 120,
                    x: 100,
                    y: 100,
                    type: 'textarea',
                    content: 'Textarea'
                },
                description: 'Multi-line text input'
            },
            {
                id: 'button',
                name: 'Button',
                type: 'button',
                category: 'forms',
                icon: MousePointer2,
                defaultProps: {
                    width: 120,
                    height: 40,
                    x: 100,
                    y: 100,
                    type: 'button',
                    content: 'Button'
                },
                description: 'Action button'
            },
            {
                id: 'checkbox',
                name: 'Checkbox',
                type: 'checkbox',
                category: 'forms',
                icon: Check,
                defaultProps: {
                    width: 20,
                    height: 20,
                    x: 100,
                    y: 100,
                    type: 'checkbox'
                },
                description: 'Checkbox input'
            },
            {
                id: 'radio',
                name: 'Radio Button',
                type: 'radio',
                category: 'forms',
                icon: Circle,
                defaultProps: {
                    width: 20,
                    height: 20,
                    x: 100,
                    y: 100,
                    type: 'radio'
                },
                description: 'Radio button'
            },
            {
                id: 'select',
                name: 'Select Dropdown',
                type: 'select',
                category: 'forms',
                icon: ChevronDown,
                defaultProps: {
                    width: 200,
                    height: 40,
                    x: 100,
                    y: 100,
                    type: 'select',
                    content: 'Select option ▼'
                },
                description: 'Dropdown menu'
            },
            {
                id: 'switch',
                name: 'Toggle Switch',
                type: 'switch',
                category: 'forms',
                icon: Settings,
                defaultProps: {
                    width: 50,
                    height: 25,
                    x: 100,
                    y: 100,
                    type: 'switch'
                },
                description: 'Toggle switch'
            },
            {
                id: 'upload',
                name: 'File Upload',
                type: 'upload',
                category: 'forms',
                icon: Upload,
                defaultProps: {
                    width: 300,
                    height: 150,
                    x: 100,
                    y: 100,
                    type: 'upload',
                    content: '↑ Upload File'
                },
                description: 'File upload zone'
            },
            {
                id: 'search',
                name: 'Search Bar',
                type: 'search',
                category: 'forms',
                icon: Search,
                defaultProps: {
                    width: 300,
                    height: 40,
                    x: 100,
                    y: 100,
                    type: 'search',
                    content: '🔍 Search...'
                },
                description: 'Search input'
            }
        ]
    },
    {
        id: 'layout',
        name: 'Layout',
        icon: LayoutGrid,
        components: [
            {
                id: 'hero',
                name: 'Hero Section',
                type: 'hero',
                category: 'layout',
                icon: LayoutGrid,
                defaultProps: {
                    width: 1200,
                    height: 500,
                    x: 0,
                    y: 80,
                    type: 'hero',
                    content: 'HEADLINE\\nSubheadline text\\n[Get Started]'
                },
                description: 'Hero banner section'
            },
            {
                id: 'feature-grid-3',
                name: 'Feature Grid (3-col)',
                type: 'feature-grid-3',
                category: 'layout',
                icon: Grid3x3,
                defaultProps: {
                    width: 1000,
                    height: 300,
                    x: 100,
                    y: 100,
                    type: 'feature-grid-3',
                    content: '[Icon]\\nFeature 1 | [Icon]\\nFeature 2 | [Icon]\\nFeature 3'
                },
                description: '3-column feature grid'
            },
            {
                id: 'feature-grid-4',
                name: 'Feature Grid (4-col)',
                type: 'feature-grid-4',
                category: 'layout',
                icon: Grid3x3,
                defaultProps: {
                    width: 1200,
                    height: 250,
                    x: 0,
                    y: 100,
                    type: 'feature-grid-4',
                    content: 'F1 | F2 | F3 | F4'
                },
                description: '4-column feature grid'
            },
            {
                id: 'card',
                name: 'Card',
                type: 'card',
                category: 'layout',
                icon: CreditCard,
                defaultProps: {
                    width: 300,
                    height: 200,
                    x: 100,
                    y: 100,
                    type: 'card',
                    content: 'Card Title\\nCard content'
                },
                description: 'Content card'
            },
            {
                id: 'section',
                name: 'Content Section',
                type: 'section',
                category: 'layout',
                icon: Container,
                defaultProps: {
                    width: 1200,
                    height: 400,
                    x: 0,
                    y: 100,
                    type: 'section',
                    content: 'SECTION TITLE\\nContent area'
                },
                description: 'Full-width section'
            }
        ]
    },
    {
        id: 'data',
        name: 'Data Display',
        icon: Table2,
        components: [
            {
                id: 'table',
                name: 'Table',
                type: 'table',
                category: 'data',
                icon: Table2,
                defaultProps: {
                    width: 600,
                    height: 300,
                    x: 100,
                    y: 100,
                    type: 'table',
                    content: 'Col1 | Col2 | Col3\\nRow1 | Data | Data\\nRow2 | Data | Data'
                },
                description: 'Data table'
            },
            {
                id: 'list',
                name: 'List',
                type: 'list',
                category: 'data',
                icon: List,
                defaultProps: {
                    width: 300,
                    height: 200,
                    x: 100,
                    y: 100,
                    type: 'list',
                    content: '• Item 1\\n• Item 2\\n• Item 3\\n• Item 4'
                },
                description: 'Bullet list'
            },
            {
                id: 'stats',
                name: 'Stats Card',
                type: 'stats',
                category: 'data',
                icon: BarChart3,
                defaultProps: {
                    width: 200,
                    height: 120,
                    x: 100,
                    y: 100,
                    type: 'stats',
                    content: '1,234\\nTotal Users'
                },
                description: 'Statistics display'
            },
            {
                id: 'pricing',
                name: 'Pricing Card',
                type: 'pricing',
                category: 'data',
                icon: CreditCard,
                defaultProps: {
                    width: 300,
                    height: 400,
                    x: 100,
                    y: 100,
                    type: 'pricing',
                    content: 'PRO\\n$29/mo\\n✓ Feature 1\\n✓ Feature 2\\n[Buy Now]'
                },
                description: 'Pricing table card'
            },
            {
                id: 'timeline',
                name: 'Timeline',
                type: 'timeline',
                category: 'data',
                icon: Clock,
                defaultProps: {
                    width: 400,
                    height: 300,
                    x: 100,
                    y: 100,
                    type: 'timeline',
                    content: '2024 - Event\\n2023 - Event\\n2022 - Event'
                },
                description: 'Timeline view'
            }
        ]
    },
    {
        id: 'media',
        name: 'Media',
        icon: ImageIcon,
        components: [
            {
                id: 'image',
                name: 'Image Placeholder',
                type: 'image',
                category: 'media',
                icon: ImageIcon,
                defaultProps: {
                    width: 300,
                    height: 200,
                    x: 100,
                    y: 100,
                    type: 'image',
                    content: '[IMAGE]'
                },
                description: 'Image placeholder'
            },
            {
                id: 'video',
                name: 'Video Placeholder',
                type: 'video',
                category: 'media',
                icon: ImageIcon,
                defaultProps: {
                    width: 640,
                    height: 360,
                    x: 100,
                    y: 100,
                    type: 'video',
                    content: '▶ [VIDEO]'
                },
                description: 'Video player placeholder'
            },
            {
                id: 'avatar',
                name: 'Avatar',
                type: 'avatar',
                category: 'media',
                icon: User,
                defaultProps: {
                    width: 60,
                    height: 60,
                    x: 100,
                    y: 100,
                    type: 'avatar'
                },
                description: 'User avatar'
            },
            {
                id: 'icon',
                name: 'Icon',
                type: 'icon',
                category: 'media',
                icon: Star,
                defaultProps: {
                    width: 40,
                    height: 40,
                    x: 100,
                    y: 100,
                    type: 'icon',
                    content: '★'
                },
                description: 'Icon placeholder'
            },
            {
                id: 'gallery',
                name: 'Gallery Grid',
                type: 'gallery',
                category: 'media',
                icon: Grid3x3,
                defaultProps: {
                    width: 600,
                    height: 400,
                    x: 100,
                    y: 100,
                    type: 'gallery',
                    content: '[IMG][IMG][IMG]\\n[IMG][IMG][IMG]'
                },
                description: 'Image gallery'
            }
        ]
    },
    {
        id: 'interactive',
        name: 'Interactive',
        icon: MousePointer2,
        components: [
            {
                id: 'modal',
                name: 'Modal',
                type: 'modal',
                category: 'interactive',
                icon: X,
                defaultProps: {
                    width: 500,
                    height: 300,
                    x: 350,
                    y: 200,
                    type: 'modal',
                    content: 'Modal Title [X]\\nModal content\\n[Cancel] [Confirm]'
                },
                description: 'Modal dialog'
            },
            {
                id: 'tooltip',
                name: 'Tooltip',
                type: 'tooltip',
                category: 'interactive',
                icon: Info,
                defaultProps: {
                    width: 120,
                    height: 40,
                    x: 100,
                    y: 100,
                    type: 'tooltip',
                    content: 'Tooltip text'
                },
                description: 'Tooltip bubble'
            },
            {
                id: 'accordion',
                name: 'Accordion',
                type: 'accordion',
                category: 'interactive',
                icon: ChevronDown,
                defaultProps: {
                    width: 400,
                    height: 200,
                    x: 100,
                    y: 100,
                    type: 'accordion',
                    content: '▼ Section 1\\n  Content\\n▶ Section 2\\n▶ Section 3'
                },
                description: 'Accordion menu'
            },
            {
                id: 'alert',
                name: 'Alert',
                type: 'alert',
                category: 'interactive',
                icon: Bell,
                defaultProps: {
                    width: 400,
                    height: 60,
                    x: 100,
                    y: 100,
                    type: 'alert',
                    content: 'ℹ Alert message [x]'
                },
                description: 'Alert notification'
            },
            {
                id: 'badge',
                name: 'Badge',
                type: 'badge',
                category: 'interactive',
                icon: Star,
                defaultProps: {
                    width: 60,
                    height: 25,
                    x: 100,
                    y: 100,
                    type: 'badge',
                    content: 'New'
                },
                description: 'Badge label'
            },
            {
                id: 'progress',
                name: 'Progress Bar',
                type: 'progress',
                category: 'interactive',
                icon: BarChart3,
                defaultProps: {
                    width: 300,
                    height: 20,
                    x: 100,
                    y: 100,
                    type: 'progress',
                    content: '70%'
                },
                description: 'Progress indicator'
            }
        ]
    },
    {
        id: 'advanced-forms',
        name: 'Advanced Forms',
        icon: Sliders,
        components: [
            {
                id: 'datepicker',
                name: 'Date Picker',
                type: 'datepicker',
                category: 'advanced-forms',
                icon: Calendar,
                defaultProps: {
                    width: 280,
                    height: 320,
                    x: 100,
                    y: 100,
                    type: 'datepicker',
                    content: '📅 Select Date\n[Calendar Grid]'
                },
                description: 'Calendar date picker'
            },
            {
                id: 'timepicker',
                name: 'Time Picker',
                type: 'timepicker',
                category: 'advanced-forms',
                icon: Clock,
                defaultProps: {
                    width: 200,
                    height: 50,
                    x: 100,
                    y: 100,
                    type: 'timepicker',
                    content: '🕐 12:00 PM'
                },
                description: 'Time selection'
            },
            {
                id: 'colorpicker',
                name: 'Color Picker',
                type: 'colorpicker',
                category: 'advanced-forms',
                icon: Palette,
                defaultProps: {
                    width: 250,
                    height: 280,
                    x: 100,
                    y: 100,
                    type: 'colorpicker',
                    content: '[Color Grid]\n#3B82F6'
                },
                description: 'Color selection tool'
            },
            {
                id: 'slider',
                name: 'Range Slider',
                type: 'slider',
                category: 'advanced-forms',
                icon: Sliders,
                defaultProps: {
                    width: 300,
                    height: 40,
                    x: 100,
                    y: 100,
                    type: 'slider',
                    content: '50'
                },
                description: 'Value range slider'
            },
            {
                id: 'multiselect',
                name: 'Multi-Select',
                type: 'multiselect',
                category: 'advanced-forms',
                icon: Check,
                defaultProps: {
                    width: 250,
                    height: 45,
                    x: 100,
                    y: 100,
                    type: 'multiselect',
                    content: 'Selected (3) ▼'
                },
                description: 'Multiple selection dropdown'
            },
            {
                id: 'autocomplete',
                name: 'Autocomplete',
                type: 'autocomplete',
                category: 'advanced-forms',
                icon: Search,
                defaultProps: {
                    width: 300,
                    height: 45,
                    x: 100,
                    y: 100,
                    type: 'autocomplete',
                    content: 'Search...'
                },
                description: 'Auto-suggest input'
            },
            {
                id: 'rating',
                name: 'Star Rating',
                type: 'rating',
                category: 'advanced-forms',
                icon: Star,
                defaultProps: {
                    width: 150,
                    height: 30,
                    x: 100,
                    y: 100,
                    type: 'rating',
                    content: '★★★★☆'
                },
                description: 'Star rating input'
            },
            {
                id: 'togglegroup',
                name: 'Toggle Group',
                type: 'togglegroup',
                category: 'advanced-forms',
                icon: Grid,
                defaultProps: {
                    width: 300,
                    height: 45,
                    x: 100,
                    y: 100,
                    type: 'togglegroup',
                    content: '[Left] Center Right'
                },
                description: 'Button toggle group'
            },
            {
                id: 'otpinput',
                name: 'OTP Input',
                type: 'otpinput',
                category: 'advanced-forms',
                icon: Hash,
                defaultProps: {
                    width: 240,
                    height: 60,
                    x: 100,
                    y: 100,
                    type: 'otpinput',
                    content: '□ □ □ □ □ □'
                },
                description: 'One-time password input'
            }
        ]
    },
    {
        id: 'advanced-nav',
        name: 'Advanced Navigation',
        icon: Menu,
        components: [
            {
                id: 'megamenu',
                name: 'Mega Menu',
                type: 'megamenu',
                category: 'advanced-nav',
                icon: Menu,
                defaultProps: {
                    width: 800,
                    height: 350,
                    x: 100,
                    y: 100,
                    type: 'megamenu',
                    content: 'Products\n[Grid of items]'
                },
                description: 'Large dropdown menu'
            },
            {
                id: 'dropdown',
                name: 'Dropdown Menu',
                type: 'dropdown',
                category: 'advanced-nav',
                icon: ChevronDown,
                defaultProps: {
                    width: 200,
                    height: 180,
                    x: 100,
                    y: 100,
                    type: 'dropdown',
                    content: 'Option 1\nOption 2\nOption 3'
                },
                description: 'Simple dropdown'
            },
            {
                id: 'contextmenu',
                name: 'Context Menu',
                type: 'contextmenu',
                category: 'advanced-nav',
                icon: Menu,
                defaultProps: {
                    width: 180,
                    height: 160,
                    x: 100,
                    y: 100,
                    type: 'contextmenu',
                    content: 'Cut\nCopy\nPaste\n---\nDelete'
                },
                description: 'Right-click menu'
            },
            {
                id: 'stepper',
                name: 'Stepper',
                type: 'stepper',
                category: 'advanced-nav',
                icon: Zap,
                defaultProps: {
                    width: 600,
                    height: 80,
                    x: 100,
                    y: 100,
                    type: 'stepper',
                    content: '① Details → ② Review → ③ Complete'
                },
                description: 'Step wizard'
            },
            {
                id: 'commandpalette',
                name: 'Command Palette',
                type: 'commandpalette',
                category: 'advanced-nav',
                icon: Search,
                defaultProps: {
                    width: 500,
                    height: 300,
                    x: 200,
                    y: 100,
                    type: 'commandpalette',
                    content: '⌘ Search commands...'
                },
                description: 'Quick command search'
            },
            {
                id: 'bottomnav',
                name: 'Bottom Navigation',
                type: 'bottomnav',
                category: 'advanced-nav',
                icon: Menu,
                defaultProps: {
                    width: 400,
                    height: 70,
                    x: 100,
                    y: 700,
                    type: 'bottomnav',
                    content: '🏠 Home | 🔍 Search | 👤 Profile'
                },
                description: 'Mobile bottom nav'
            },
            {
                id: 'fab',
                name: 'FAB Button',
                type: 'fab',
                category: 'advanced-nav',
                icon: Plus,
                defaultProps: {
                    width: 60,
                    height: 60,
                    x: 900,
                    y: 700,
                    type: 'fab',
                    content: '+'
                },
                description: 'Floating action button'
            }
        ]
    },
    {
        id: 'feedback',
        name: 'Feedback & Loading',
        icon: Loader,
        components: [
            {
                id: 'toast',
                name: 'Toast Notification',
                type: 'toast',
                category: 'feedback',
                icon: Bell,
                defaultProps: {
                    width: 350,
                    height: 80,
                    x: 800,
                    y: 50,
                    type: 'toast',
                    content: '✓ Success! Action completed'
                },
                description: 'Toast notification'
            },
            {
                id: 'snackbar',
                name: 'Snackbar',
                type: 'snackbar',
                category: 'feedback',
                icon: MessageCircle,
                defaultProps: {
                    width: 300,
                    height: 50,
                    x: 400,
                    y: 700,
                    type: 'snackbar',
                    content: 'Message sent [UNDO]'
                },
                description: 'Bottom snackbar'
            },
            {
                id: 'skeleton',
                name: 'Loading Skeleton',
                type: 'skeleton',
                category: 'feedback',
                icon: Loader,
                defaultProps: {
                    width: 300,
                    height: 150,
                    x: 100,
                    y: 100,
                    type: 'skeleton',
                    content: '[Loading bars]'
                },
                description: 'Content placeholder'
            },
            {
                id: 'spinner',
                name: 'Spinner',
                type: 'spinner',
                category: 'feedback',
                icon: Loader,
                defaultProps: {
                    width: 60,
                    height: 60,
                    x: 100,
                    y: 100,
                    type: 'spinner',
                    content: '⟳'
                },
                description: 'Loading spinner'
            },
            {
                id: 'emptystate',
                name: 'Empty State',
                type: 'emptystate',
                category: 'feedback',
                icon: FileText,
                defaultProps: {
                    width: 400,
                    height: 300,
                    x: 200,
                    y: 200,
                    type: 'emptystate',
                    content: '📂\nNo items found\n[Add Item]'
                },
                description: 'Empty state placeholder'
            }
        ]
    },
    {
        id: 'advanced-layout',
        name: 'Advanced Layout',
        icon: LayoutGrid,
        components: [
            {
                id: 'carousel',
                name: 'Carousel',
                type: 'carousel',
                category: 'advanced-layout',
                icon: ImageIcon,
                defaultProps: {
                    width: 600,
                    height: 300,
                    x: 100,
                    y: 100,
                    type: 'carousel',
                    content: '< [Slide 1] >'
                },
                description: 'Image carousel'
            },
            {
                id: 'splitpane',
                name: 'Split Pane',
                type: 'splitpane',
                category: 'advanced-layout',
                icon: Columns,
                defaultProps: {
                    width: 600,
                    height: 400,
                    x: 100,
                    y: 100,
                    type: 'splitpane',
                    content: 'Left Pane | Right Pane'
                },
                description: 'Resizable split view'
            },
            {
                id: 'kanban',
                name: 'Kanban Board',
                type: 'kanban',
                category: 'advanced-layout',
                icon: Grid3x3,
                defaultProps: {
                    width: 900,
                    height: 500,
                    x: 100,
                    y: 100,
                    type: 'kanban',
                    content: 'Todo | In Progress | Done'
                },
                description: 'Kanban task board'
            }
        ]
    }
]

// Get all components as a flat array
export const getAllComponents = (): ComponentTemplate[] => {
    return componentCategories.flatMap(cat => cat.components)
}

// Get components by category
export const getComponentsByCategory = (categoryId: string): ComponentTemplate[] => {
    const category = componentCategories.find(cat => cat.id === categoryId)
    return category?.components || []
}

// Get component by ID
export const getComponentById = (id: string): ComponentTemplate | undefined => {
    return getAllComponents().find(comp => comp.id === id)
}
