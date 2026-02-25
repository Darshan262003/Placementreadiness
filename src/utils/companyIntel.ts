export type CompanySize = 'Startup' | 'Mid-size' | 'Enterprise'

export interface CompanyIntel {
  name: string
  industry: string
  size: CompanySize
  hiringFocus: string
}

export interface RoundMapping {
  round: number
  title: string
  description: string
  whyItMatters: string
  focusAreas: string[]
}

// Known enterprise companies
const ENTERPRISE_COMPANIES = [
  'amazon', 'microsoft', 'google', 'apple', 'meta', 'facebook',
  'infosys', 'tcs', 'wipro', 'cognizant', 'accenture', 'ibm',
  'oracle', 'sap', 'salesforce', 'adobe', 'intel', 'qualcomm',
  'cisco', 'dell', 'hp', 'hpe', 'vmware', 'broadcom',
  'goldman sachs', 'jpmorgan', 'morgan stanley', 'barclays',
  'deutsche bank', 'ubs', 'wells fargo', 'bank of america',
  'capgemini', 'deloitte', 'ey', 'pwc', 'kpmg',
  'samsung', 'lg', 'sony', 'panasonic', 'toshiba',
  'toyota', 'honda', 'bmw', 'mercedes', 'volkswagen',
  'siemens', 'bosch', 'ge', 'philips', 'hitachi'
]

// Known mid-size companies
const MIDSIZE_COMPANIES = [
  'zoho', 'freshworks', 'postman', 'razorpay', 'zerodha',
  'swiggy', 'zomato', 'ola', 'uber india', 'cred',
  'phonepe', 'paytm', 'byju', 'unacademy', 'vedantu',
  'meesho', 'nykaa', 'urban company', 'dream11', ' MPL'
]

export function detectCompanySize(companyName: string): CompanySize {
  const normalized = companyName.toLowerCase().trim()
  
  if (ENTERPRISE_COMPANIES.some(c => normalized.includes(c))) {
    return 'Enterprise'
  }
  
  if (MIDSIZE_COMPANIES.some(c => normalized.includes(c))) {
    return 'Mid-size'
  }
  
  // Default to Startup for unknown companies
  return 'Startup'
}

export function inferIndustry(companyName: string, jdText: string): string {
  const text = (companyName + ' ' + jdText).toLowerCase()
  
  // Financial services
  if (text.includes('bank') || text.includes('finance') || text.includes('fintech') || 
      text.includes('trading') || text.includes('investment') || text.includes('payment')) {
    return 'Financial Services'
  }
  
  // Healthcare
  if (text.includes('health') || text.includes('medical') || text.includes('pharma') || 
      text.includes('biotech') || text.includes('clinical')) {
    return 'Healthcare'
  }
  
  // E-commerce / Retail
  if (text.includes('e-commerce') || text.includes('retail') || text.includes('shopping') || 
      text.includes('marketplace') || text.includes('consumer')) {
    return 'E-commerce & Retail'
  }
  
  // SaaS / Software
  if (text.includes('saas') || text.includes('software') || text.includes('cloud') || 
      text.includes('platform')) {
    return 'SaaS / Software'
  }
  
  // Automotive
  if (text.includes('automotive') || text.includes('vehicle') || text.includes('car') || 
      text.includes('auto ')) {
    return 'Automotive'
  }
  
  // Telecommunications
  if (text.includes('telecom') || text.includes('network') || text.includes('wireless') || 
      text.includes('5g') || text.includes('broadband')) {
    return 'Telecommunications'
  }
  
  // Default
  return 'Technology Services'
}

export function getHiringFocus(size: CompanySize): string {
  switch (size) {
    case 'Enterprise':
      return 'Structured DSA + core fundamentals. Emphasis on algorithmic problem solving, system design at scale, and proven academic credentials. Multiple structured rounds with standardized evaluation.'
    case 'Mid-size':
      return 'Balanced approach: DSA fundamentals + practical implementation. Focus on product thinking, code quality, and ability to ship features. Mix of structured and practical assessments.'
    case 'Startup':
      return 'Practical problem solving + stack depth. Emphasis on versatility, ownership mindset, and immediate contribution. Often includes take-home projects and culture fit evaluation.'
  }
}

export function generateCompanyIntel(companyName: string, jdText: string): CompanyIntel | null {
  if (!companyName.trim()) return null
  
  const size = detectCompanySize(companyName)
  const industry = inferIndustry(companyName, jdText)
  const hiringFocus = getHiringFocus(size)
  
  return {
    name: companyName,
    industry,
    size,
    hiringFocus
  }
}

export function generateRoundMapping(
  companySize: CompanySize,
  hasDSA: boolean,
  hasWeb: boolean,
  hasSystemDesign: boolean
): RoundMapping[] {
  switch (companySize) {
    case 'Enterprise':
      return [
        {
          round: 1,
          title: 'Online Assessment',
          description: 'Aptitude + Coding (DSA focus)',
          whyItMatters: 'Filters candidates based on fundamental problem-solving abilities and basic technical aptitude. High volume screening tool.',
          focusAreas: hasDSA 
            ? ['Array/String manipulation', 'Basic tree/graph problems', 'Time complexity analysis', 'Aptitude (quant + logical)']
            : ['Logical reasoning', 'Basic coding patterns', 'Numerical ability', 'Verbal comprehension']
        },
        {
          round: 2,
          title: 'Technical Round 1',
          description: 'DSA + Core CS Fundamentals',
          whyItMatters: 'Validates depth of computer science knowledge and ability to solve complex algorithmic problems under pressure.',
          focusAreas: hasDSA
            ? ['Advanced DSA (DP, Graphs)', 'OOP principles', 'DBMS concepts', 'OS fundamentals']
            : ['Programming fundamentals', 'Basic DSA', 'Problem decomposition', 'Code optimization']
        },
        {
          round: 3,
          title: 'Technical Round 2',
          description: 'Projects + System Design (LLD/HLD)',
          whyItMatters: 'Assesses practical experience, design thinking, and ability to build scalable solutions.',
          focusAreas: hasSystemDesign
            ? ['Low-level design (classes, patterns)', 'High-level system design', 'Database schema design', 'API design principles']
            : ['Project deep dive', 'Code review discussion', 'Design patterns basics', 'Scalability concepts']
        },
        {
          round: 4,
          title: 'Managerial / HR',
          description: 'Behavioral + Culture Fit + Compensation',
          whyItMatters: 'Evaluates alignment with company values, communication skills, and long-term potential.',
          focusAreas: ['STAR method responses', 'Why this company?', 'Career aspirations', 'Salary negotiation prep']
        }
      ]
      
    case 'Mid-size':
      return [
        {
          round: 1,
          title: 'Technical Screening',
          description: 'Coding + Problem Solving',
          whyItMatters: 'Quick assessment of coding ability and thought process. Often conducted by senior engineers.',
          focusAreas: hasDSA
            ? ['Medium DSA problems', 'Code quality', 'Edge case handling', 'Optimization approach']
            : ['Practical coding', 'Language proficiency', 'Debugging skills', 'Problem breakdown']
        },
        {
          round: 2,
          title: 'Technical Deep Dive',
          description: 'Stack-specific + Projects',
          whyItMatters: 'Validates expertise in relevant technologies and real-world project experience.',
          focusAreas: hasWeb
            ? ['Framework specifics (React/Node)', 'State management', 'API integration', 'Performance optimization']
            : ['Language deep dive', 'Tool/framework knowledge', 'Project architecture', 'Best practices']
        },
        {
          round: 3,
          title: 'System Design / Practical',
          description: hasSystemDesign ? 'System Design Discussion' : 'Take-home or Live Coding',
          whyItMatters: 'Tests ability to design solutions or complete practical tasks under realistic constraints.',
          focusAreas: hasSystemDesign
            ? ['Component design', 'Database modeling', 'API specifications', 'Trade-off analysis']
            : ['End-to-end implementation', 'Code organization', 'Testing approach', 'Documentation']
        },
        {
          round: 4,
          title: 'Culture & Leadership',
          description: 'Behavioral + Company Values',
          whyItMatters: 'Ensures candidate fits the company culture and can collaborate effectively in the team.',
          focusAreas: ['Past collaboration examples', 'Conflict resolution', 'Ownership mindset', 'Growth mindset']
        }
      ]
      
    case 'Startup':
      return [
        {
          round: 1,
          title: 'Practical Coding',
          description: 'Real-world Problem Solving',
          whyItMatters: 'Startups need people who can code and deliver. Focus is on practical skills over theoretical knowledge.',
          focusAreas: hasWeb
            ? ['Build a small feature', 'API consumption', 'Frontend component', 'Debug existing code']
            : ['Language proficiency', 'Problem-solving approach', 'Code readability', 'Quick iteration']
        },
        {
          round: 2,
          title: 'System / Architecture Discussion',
          description: 'Design Thinking + Trade-offs',
          whyItMatters: 'Startups value engineers who can think about the big picture and make pragmatic architectural decisions.',
          focusAreas: ['MVP design approach', 'Technology choices', 'Scalability considerations', 'Cost-aware decisions']
        },
        {
          round: 3,
          title: 'Founder / Team Fit',
          description: 'Culture + Vision Alignment',
          whyItMatters: 'Early team members shape the culture. Startups prioritize passion, versatility, and mission alignment.',
          focusAreas: ['Why startup?', 'Adaptability examples', 'Multi-tasking ability', 'Learning mindset', 'Equity understanding']
        }
      ]
  }
}
