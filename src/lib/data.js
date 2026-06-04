export const journals = [
  {
    id: 'jeiml',
    slug: 'jeiml',
    acronym: 'JEIML',
    title: 'Journal of Eye-Innovation in Machine Learning',
    issn: '',
    chief: 'Prof. Dr. M. Irfan Uddin',
    publishingModel: 'Open access',
    frequency: 'Quarterly',
    reviewType: 'Double Blind Review',
    doiPrefix: '',
    publisher: 'Eye-Innovations Scientific Research (EISR)',
    reviewSpeed: '60 days',
    aims: 'JEIML aims to promote scientific excellence, foster interdisciplinary collaboration, and support the rapid dissemination of impactful research. All submitted manuscripts undergo a rigorous double-blind peer-review process to ensure originality, technical quality, clarity, and relevance.',
    scope: [
      'Machine Learning Algorithms and Models',
      'Deep Learning and Neural Networks',
      'Computer Vision and Image Processing',
      'Natural Language Processing (NLP)',
      'Explainable Artificial Intelligence (XAI)',
      'Data Mining and Big Data Analytics',
      'Reinforcement Learning',
      'AI in Healthcare and Medical Imaging',
      'Intelligent Systems and Robotics',
      'Smart Cities and IoT Applications'
    ],
    guidelines: `Journal of Eye-Innovation in Machine Learning is an international, peer-reviewed, open-access academic journal dedicated to publishing high-quality research in machine learning, artificial intelligence, deep learning, computer vision, data science, and related emerging technologies. The journal engages both established and emerging researchers from around the world and upholds the highest standards of academic integrity and scholarly excellence.

Authors are required to prepare their manuscripts using the JEIML Word Template and submit them through the online submission system. Only manuscripts that strictly follow the journal’s formatting and submission guidelines will be considered for peer review.

Submitted manuscripts must be original, unpublished, and not under consideration by any other journal or conference.

All submissions undergo a rigorous peer-review process conducted by experts in the relevant fields. Manuscripts are evaluated based on originality, technical quality, clarity of presentation, methodological soundness, and scientific contribution.

In line with our commitment to timely dissemination of research, the journal aims to complete the peer-review process within four weeks. If authors do not receive any updates within this period, they are encouraged to contact the editorial office via email.

Journal of Eye-Innovation in Machine Learning (JEIML) is an open-access international journal, ensuring free and unrestricted access to published research for the global academic and professional community.`,
    editorialTeam: [
      { id: 'irfan-uddin', name: 'Prof. Dr. M. Irfan Uddin', affiliation: 'Professor Department of Computer Science, University of Swabi Anbar Swabi 23540, KP, Pakistan', role: 'Editor in Chief', photo: '/prof_irfan_uddin_uploaded.png' },
      { id: 'nesren-farhah', name: 'Dr. Nesren S. Farhah', affiliation: 'Saudi Electronic University: Riyadh, SA', email: 'N.FARHAH@seu.edu.sa', orcid: '0000-0002-2103-1282', role: 'Managing Editor', photo: '/dr_nesren_uploaded.png' },
      { id: 'rajit-nair', name: 'Rajit Nair', affiliation: 'VIT Bhopal University, Bhopal, India', email: 'rajitnitbpl@gmail.com', orcid: '0000-0002-3796-7958', role: 'Editorial Board Member' },
      { id: 'farooq-ahmed', name: 'Farooq Ahmed', affiliation: 'Manchester Metropolitan University', email: 'farooqahmed@hainanu.edu.cn', orcid: '0000-0002-4668-2882', role: 'Editorial Board Member' },
      { id: 'manish-joshi', name: 'Dr. Manish Joshi', affiliation: 'School of Computer Sciences, North Maharashtra University, Jalgaon, India', role: 'Editorial Board Member' },
      { id: 'furqan-aziz', name: 'Dr. Furqan Aziz', affiliation: 'School of Computing and Mathematical Sciences, The University of Leicester, Leicester, United Kingdom', email: 'fa311@leicester.ac.uk', role: 'Editorial Board Member' },
      { id: 'shahreen-kasim', name: 'Dr. Shahreen Kasim', affiliation: 'Faculty of Electrical and Electronic Engineering (FKEE), Universiti Tun Hussein Onn Malaysia, Batu Pahat Johor, Malaysia', orcid: '0000-0002-4180-4377', role: 'Editorial Board Member' }
    ],
    indexing: 'Journal of Eye-Innovation in Machine Learning (JEIML) is indexed and archived in leading scholarly platforms, ensuring global visibility and long-term accessibility of published research.',
    indexingPartners: ['Crossref', 'Google Scholar'],
    apc: 'No APC Charge',
    policies: {
      publicationethics: `{{JOURNAL_NAME}} ({{JOURNAL_ACRONYM}}) is committed to upholding the highest standards of publication ethics and academic integrity. The journal follows internationally accepted ethical guidelines to ensure transparency, fairness, and quality in scholarly publishing. All parties involved in the publication process — authors, reviewers, editors, and the publisher — are expected to adhere to these ethical principles.\n\n1. Duties of Authors\nAuthors submitting manuscripts to {{JOURNAL_ACRONYM}} must ensure that:\n• The submitted work is original, unpublished, and not under consideration elsewhere.\n• All sources are properly cited, and plagiarism in any form is strictly prohibited.\n• Data presented in the manuscript is accurate, honest, and not fabricated or manipulated.\n• All listed authors have made significant contributions to the research.\n• Any conflicts of interest are clearly disclosed.\n• Ethical approval is obtained for studies involving human participants or animals, where applicable.\n\n2. Duties of Editors\nEditors are responsible for:\n• Making fair, unbiased, and timely publication decisions based solely on academic merit.\n• Maintaining the confidentiality of submitted manuscripts.\n• Ensuring a rigorous and transparent peer-review process.\n• Taking appropriate actions in cases of suspected misconduct, plagiarism, or ethical violations.\n• Preventing conflicts of interest and ensuring editorial independence.\n\n3. Duties of Reviewers\nReviewers are expected to:\n• Conduct reviews objectively, fairly, and confidentially.\n• Provide constructive feedback to improve the quality of manuscripts.\n• Report any suspected plagiarism, duplication, or ethical issues.\n• Declare any conflicts of interest and decline reviews when necessary.`,
      openaccess: `{{JOURNAL_ACRONYM}} is a fully open-access journal, providing immediate, free, and permanent access to all published content. Readers may read, download, copy, distribute, print, search, and link to full texts without restriction, ensuring global knowledge dissemination and increased research visibility.`,
      peerreview: `{{JOURNAL_ACRONYM}} adopts a double-blind peer review process. Each submission is reviewed by at least two independent expert reviewers. Editors make publication decisions based on originality, quality, clarity, relevance, and technical soundness. Reviewers remain anonymous, and manuscripts are treated confidentially.`,
      archiving: `{{JOURNAL_ACRONYM}} ensures long-term digital preservation of all published content using secure electronic archiving systems. Published articles are permanently stored on journal servers and third-party repositories to ensure content availability, accessibility, and integrity.`,
      generativeai: 'Authors may use generative AI tools strictly for language editing, grammar checking, and formatting improvements. Authors must fully disclose the use of AI tools in manuscript preparation. AI tools must not be listed as authors, and responsibility for the accuracy, originality, and ethics of the content remains solely with human authors.',
      copyright: `All articles published in {{JOURNAL_ACRONYM}} are licensed under the Creative Commons Attribution (CC BY 4.0) license. Authors retain full copyright of their work, allowing readers to copy, distribute, and adapt the content with proper attribution.`,
      plagiarism: `All manuscripts submitted to {{JOURNAL_ACRONYM}} are screened using professional plagiarism detection software. Manuscripts exceeding 15–20% similarity index (excluding references) will be rejected or returned for revision. Zero tolerance is applied to intentional plagiarism.`,
      misconduct: 'Scientific misconduct includes: \n• Plagiarism \n• Fabrication or falsification of data \n• Duplicate submission \n• Authorship manipulation \n• Citation manipulation \nConfirmed misconduct results in rejection, retraction, notification of institutions, and banning from future submissions.',
      retractions: `{{JOURNAL_ACRONYM}} publishes retractions when major errors, ethical breaches, or scientific misconduct are confirmed. Retracted articles remain online but are clearly marked as Retracted, preserving the scholarly record.`,
      misbehavior: 'Unethical actions such as submission manipulation, peer-review interference, citation gaming, and identity falsification are treated as serious violations and lead to strict disciplinary action.',
      corrections: `{{JOURNAL_ACRONYM}} allows: \n• Corrections (Errata) for minor errors not affecting conclusions. \n• Withdrawals for early-stage submissions before peer review. \nPost-publication withdrawals are permitted only in exceptional circumstances.`
    },
    stats: {
      citationsScopus: '----',
      citationsGoogle: '----',
      articles: '----',
      views: '----',
      authors: '----',
      distribution: '----',
      acceptance: '----'
    },
    organizer: 'Institute for Systems Intelligence Research (ISIR) & Scholarly Council on Computational Sciences',
    digitalMarketing: [
      { name: 'Email', icon: 'Mail', url: 'mailto:info@EISRpress.com' },
      { name: 'LinkedIn', icon: 'Linkedin', url: '#' },
      { name: 'Instagram', icon: 'Instagram', url: '#' },
      { name: 'Facebook', icon: 'Facebook', url: '#' }
    ],
    news: [
      { id: 1, title: 'JEIML Receives Formal Acceptance into Scopus Database', date: 'November 23, 2025', image: '/scopus_news.jpg', excerpt: 'The editorial board is pleased to announce that JEIML has met all rigorous criteria for indexing in Scopus.' },
      { id: 2, title: 'Strategic Partnership with EBSCO Academic Search', date: 'October 7, 2025', image: '/ebsco_news.jpg', excerpt: 'JEIML research content is now globally searchable via the EBSCO discovery platform.' }
    ],
    about: `Journal of Eye-Innovation in Machine Learning (JEIML) is an international, peer-reviewed, open-access scholarly journal dedicated to advancing research and innovation in the fields of machine learning, artificial intelligence, deep learning, computer vision, data science, pattern recognition, and intelligent systems.

The journal aims to provide a global platform for researchers, academicians, industry professionals, and practitioners to disseminate high-quality original research, review articles, and technical contributions that present novel theoretical insights, practical methodologies, and real-world applications.

JEIML encourages interdisciplinary research that bridges theory and practice, promoting innovative solutions to complex problems across domains such as healthcare, engineering, cybersecurity, smart systems, robotics, finance, education, and industrial applications.

All submitted manuscripts undergo a rigorous double-blind peer-review process, ensuring high standards of academic quality, originality, clarity, and scientific impact. The journal is committed to maintaining ethical publishing practices, transparency, and integrity throughout the publication process.

As an open-access journal, JEIML ensures that all published articles are freely accessible to the global research community, supporting the wide dissemination and exchange of scientific knowledge.`,
    privacy: 'The names and email addresses entered in this journal site will be used exclusively for the stated purposes of this journal and will not be made available for any other purpose or to any other party.',
    contactEmail: 'JEIML@EISRpress.com',
    cover: '/jeiml_cover_new.png'
  },
  {
    id: 'jcsra',
    slug: 'jcsra',
    acronym: 'JEISA',
    title: 'Journal of Eye-Innovation in Security Analysis',
    issn: '',
    chief: 'Prof. Ali Kashif Bashir',
    publishingModel: 'Open access',
    frequency: 'Quarterly',
    reviewType: 'Double Blind Review',
    doiPrefix: '',
    publisher: 'Eye-Innovations Scientific Research (EISR)',
    reviewSpeed: '60 days',
    aims: 'JEISA aims to provide a leading platform for researchers and practitioners to discuss challenges and innovations in protecting critical information infrastructures.',
    scope: [
      'Cybersecurity Risk Management',
      'Information Security Auditing',
      'Incident Response and Disaster Recovery',
      'Network Security and Forensics',
      'Cloud and IoT Security Assessments'
    ],
    editorialTeam: [
      { id: 'ali-kashif-bashir', name: 'Ali Kashif Bashir', role: 'Editor in Chief', affiliation: 'Manchester Metropolitan University: Manchester, England, GB - Professor of Networks and Cybersecurity, Computing and Mathematics', email: 'dr.alikashif.b@ieee.org', orcid: '0000-0003-2601-9327', photo: '/ali_kashif_bashir.png' },
      { id: 'nadhem-ebrahim', name: 'Dr. Nadhem Ebrahim', role: 'Managing Editor', affiliation: 'University of Akron, Akron, United States', orcid: '0000-0001-9975-589X', photo: '/nadhem_ebrahim.png' },
      { id: 'sultan-ahmed', name: 'Dr. Sultan Ahmed', role: 'Editorial Board Member', affiliation: 'Prince Sattam Bin Abdulaziz University, Al-Kharj, Saudi Arabia', orcid: '0000-0002-3198-7974' },
      { id: 'rizwan-ali-naqvi', name: 'Dr. Rizwan Ali Naqvi', role: 'Editorial Board Member', affiliation: 'Sejong University, South Korea', orcid: '0000-0002-7473-8441' },
      { id: 'osamah-ibrahim-khalaf', name: 'Dr. Osamah Ibrahim Khalaf', role: 'Editorial Board Member', affiliation: 'Al-Nahrain University, Baghdad, Iraq', orcid: '0000-0002-4750-8384' },
      { id: 'eid-rehman', name: 'Dr. Eid Rehman', role: 'Editorial Board Member', affiliation: 'University of Mianwali, Pakistan', orcid: '' },
      { id: 'zaheen-fatima', name: 'Dr. Zaheen Fatima', role: 'Editorial Board Member', affiliation: 'Sir Syed University of Engineering and Technology, Karachi, Pakistan', orcid: '' },
      { id: 'h-jafari', name: 'Dr. H. Jafari', role: 'Editorial Board Member', affiliation: 'Professor, Department of Mathematical Sciences, University of South Africa, South Africa', orcid: '0000-0001-6807-6675' }
    ],
    guidelines: `Journal of Eye Innovation in Security Analysis is an international, peer-reviewed, open-access academic journal dedicated to publishing high-quality research in cybersecurity, information security, risk auditing, data privacy, network security, and related emerging technologies. The journal engages both established and emerging researchers from around the world and upholds the highest standards of academic integrity and scholarly excellence.

Authors are required to prepare their manuscripts using the JEISA Word Template and submit them through the online submission system. Only manuscripts that strictly follow the journal’s formatting and submission guidelines will be considered for peer review.

Submitted manuscripts must be original, unpublished, and not under consideration by any other journal or conference.

All submissions undergo a rigorous peer-review process conducted by experts in the relevant fields. Manuscripts are evaluated based on originality, technical quality, clarity of presentation, methodological soundness, and scientific contribution.

In line with our commitment to timely dissemination of research, the journal aims to complete the peer-review process within four weeks. If authors do not receive any updates within this period, they are encouraged to contact the editorial office via email.

Journal of Eye Innovation in Security Analysis (JEISA) is an open-access international journal, ensuring free and unrestricted access to published research for the global academic and professional community.`,
    indexing: 'Journal of Eye Innovation in Security Analysis (JEISA) is currently indexed in Crossref and Google Scholar.',
    indexingPartners: ['Crossref', 'Google Scholar'],
    apc: 'No APC Charge',
    stats: {
      citationsScopus: '----',
      citationsGoogle: '----',
      articles: '----',
      views: '----',
      authors: '----',
      distribution: '----',
      acceptance: '----'
    },
    organizer: 'Eye-Innovations Scientific Research Global HQ',
    digitalMarketing: [
      { name: 'Email', icon: 'Mail', url: 'mailto:info@EISRpress.com' },
      { name: 'LinkedIn', icon: 'Linkedin', url: '#' }
    ],
    policies: {
      publicationethics: `{{JOURNAL_NAME}} ({{JOURNAL_ACRONYM}}) is committed to upholding the highest standards of publication ethics and academic integrity. The journal follows internationally accepted ethical guidelines to ensure transparency, fairness, and quality in scholarly publishing. All parties involved in the publication process — authors, reviewers, editors, and the publisher — are expected to adhere to these ethical principles.\n\n1. Duties of Authors\nAuthors submitting manuscripts to {{JOURNAL_ACRONYM}} must ensure that:\n• The submitted work is original, unpublished, and not under consideration elsewhere.\n• All sources are properly cited, and plagiarism in any form is strictly prohibited.\n• Data presented in the manuscript is accurate, honest, and not fabricated or manipulated.\n• All listed authors have made significant contributions to the research.\n• Any conflicts of interest are clearly disclosed.\n• Ethical approval is obtained for studies involving human participants or animals, where applicable.\n\n2. Duties of Editors\nEditors are responsible for:\n• Making fair, unbiased, and timely publication decisions based solely on academic merit.\n• Maintaining the confidentiality of submitted manuscripts.\n• Ensuring a rigorous and transparent peer-review process.\n• Taking appropriate actions in cases of suspected misconduct, plagiarism, or ethical violations.\n• Preventing conflicts of interest and ensuring editorial independence.\n\n3. Duties of Reviewers\nReviewers are expected to:\n• Conduct reviews objectively, fairly, and confidentially.\n• Provide constructive feedback to improve the quality of manuscripts.\n• Report any suspected plagiarism, duplication, or ethical issues.\n• Declare any conflicts of interest and decline reviews when necessary.`,
      openaccess: `{{JOURNAL_ACRONYM}} is a fully open-access journal, providing immediate, free, and permanent access to all published content. Readers may read, download, copy, distribute, print, search, and link to full texts without restriction, ensuring global knowledge dissemination and increased research visibility.`,
      peerreview: `{{JOURNAL_ACRONYM}} adopts a double-blind peer review process. Each submission is reviewed by at least two independent expert reviewers. Editors make publication decisions based on originality, quality, clarity, relevance, and technical soundness. Reviewers remain anonymous, and manuscripts are treated confidentially.`,
      archiving: `{{JOURNAL_ACRONYM}} ensures long-term digital preservation of all published content using secure electronic archiving systems. Published articles are permanently stored on journal servers and third-party repositories to ensure content availability, accessibility, and integrity.`,
      generativeai: 'Authors may use generative AI tools strictly for language editing, grammar checking, and formatting improvements. Authors must fully disclose the use of AI tools in manuscript preparation. AI tools must not be listed as authors, and responsibility for the accuracy, originality, and ethics of the content remains solely with human authors.',
      copyright: `All articles published in {{JOURNAL_ACRONYM}} are licensed under the Creative Commons Attribution (CC BY 4.0) license. Authors retain full copyright of their work, allowing readers to copy, distribute, and adapt the content with proper attribution.`,
      plagiarism: `All manuscripts submitted to {{JOURNAL_ACRONYM}} are screened using professional plagiarism detection software. Manuscripts exceeding 15–20% similarity index (excluding references) will be rejected or returned for revision. Zero tolerance is applied to intentional plagiarism.`,
      misconduct: 'Scientific misconduct includes: \n• Plagiarism \n• Fabrication or falsification of data \n• Duplicate submission \n• Authorship manipulation \n• Citation manipulation \nConfirmed misconduct results in rejection, retraction, notification of institutions, and banning from future submissions.',
      retractions: `{{JOURNAL_ACRONYM}} publishes retractions when major errors, ethical breaches, or scientific misconduct are confirmed. Retracted articles remain online but are clearly marked as Retracted, preserving the scholarly record.`,
      misbehavior: 'Unethical actions such as submission manipulation, peer-review interference, citation gaming, and identity falsification are treated as serious violations and lead to strict disciplinary action.',
      corrections: `{{JOURNAL_ACRONYM}} allows: \n• Corrections (Errata) for minor errors not affecting conclusions. \n• Withdrawals for early-stage submissions before peer review. \nPost-publication withdrawals are permitted only in exceptional circumstances.`
    },
    about: `Journal of Eye Innovation in Security Analysis (JEISA) is an international, peer-reviewed, open-access scholarly journal dedicated to advancing research and innovation across cybersecurity, information security, threat intelligence, digital forensics, cryptography, network and system security, security analytics, and AI-driven security technologies.
...
As an open-access journal, JEISA ensures that all published articles are freely accessible to the global research and professional security community, supporting the wide dissemination and exchange of knowledge in the field of security analysis.`,
    contactEmail: 'JEISA@EISRpress.com',
    cover: '/jeisa_cover_new.png'
  }
];

export const articles = [];

export const editors = [
  {
    id: 'ali-kashif-bashir',
    name: 'Prof. Ali Kashif Bashir',
    role: 'Editor-in-Chief',
    affiliation: 'Manchester Metropolitan University, Manchester, United Kingdom',
    areas: ['Cybersecurity', 'Network Systems', 'Security Analysis'],
    bio: 'Prof. Ali Kashif Bashir is a Professor at Manchester Metropolitan University. His research focuses on the intersection of cybersecurity, network management, and future internet technologies.',
    photo: '/ali_kashif_bashir.png'
  },
  {
     id: 'irfan-uddin',
     name: 'Prof. Dr. M. Irfan Uddin',
     role: 'Editor-in-Chief',
     affiliation: 'University of Swabi, Pakistan',
     areas: ['Machine Learning', 'Artificial Intelligence', 'Computational Intelligence'],
     bio: 'Prof. Dr. M. Irfan Uddin is a renowned researcher in computational intelligence and machine learning applications in modern science.',
     photo: '/prof_irfan_uddin_uploaded.png'
  },
];

export const indexing = [
  { id: 'crossref', name: 'Crossref', description: 'Crossref makes research outputs easy to find, cite, link, assess, and reuse.' },
  { id: 'google-scholar', name: 'Google Scholar', description: 'Google Scholar provides a simple way to broadly search for scholarly literature.' }
];

export const journalMenuItems = [
  { name: 'Aims and scope', slug: 'aims-and-scope', icon: 'Target' },
  { name: 'Author Guidelines', slug: 'author-guidelines', icon: 'BookOpen' },
  { name: 'Editorial Team', slug: 'editorial-team', icon: 'Users' },
  { name: 'Journal Partnerships', slug: 'partnerships', icon: 'Globe' },
  { name: 'Abstracting and Indexing', slug: 'indexing', icon: 'Search' },
  { name: 'Article Publishing Charges', slug: 'apc', icon: 'CreditCard' }
];

export const journalPolicyItems = [
  { name: 'Publication Ethics Policy', slug: 'publication-ethics', icon: 'ShieldCheck' },
  { name: 'Open Access Policy', slug: 'open-access', icon: 'Unlock' },
  { name: 'Peer Review Policy', slug: 'peer-review', icon: 'UserCheck' },
  { name: 'Archiving Policy', slug: 'archiving', icon: 'FileArchive' },
  { name: 'Generative AI Policy', slug: 'generative-ai', icon: 'Cpu' },
  { name: 'Copyright and Licenses Policy', slug: 'copyright', icon: 'Copyright' },
  { name: 'Plagiarism Check Policy', slug: 'plagiarism', icon: 'Copy' },
  { name: 'Misconduct Policy', slug: 'misconduct', icon: 'AlertTriangle' },
  { name: 'Retractions Policy', slug: 'retractions', icon: 'RotateCcw' },
  { name: 'Publication Misbehavior Policy', slug: 'misbehavior', icon: 'Frown' },
  { name: 'Corrections Withdrawals Policy', slug: 'corrections', icon: 'Edit3' }
];

export const journalAboutItems = [
  { name: 'About The Journal', slug: 'about', icon: 'Info' },
  { name: 'Privacy Statement', slug: 'privacy', icon: 'ShieldText' },
  { name: 'Contact Us', slug: 'contact', icon: 'Mail' }
];

export const leaders = [
  {
    name: "Dr. Theyazn  H.H Aldhyani",
    title: "Chief Executive Officer",
    image: "/ceo.jpg"
  },
  {
    name: "Dr. Mosleh Hmoud Al-Adhaileh",
    title: "Chief Technology Officer",
    image: "/mosleh.jpg"
  }
];
