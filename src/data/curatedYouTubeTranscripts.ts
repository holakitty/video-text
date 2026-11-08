export interface CuratedYouTubeTranscript {
  videoId: string;
  title: string;
  author: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  detectedLanguage: string;
  durationSeconds: number;
  durationFormatted: string;
  wordCount: number;
  paceWpm: number;
  summary: string;
  segments: Array<{
    id: string;
    start: number;
    end: number;
    startTimeFormatted: string;
    endTimeFormatted: string;
    speaker: string;
    text: string;
  }>;
  fullText: string;
  chapters: Array<{
    title: string;
    startTime: number;
    startTimeFormatted: string;
    description: string;
  }>;
  keyTakeaways: string[];
  actionItems: Array<{
    id?: string;
    task: string;
    owner?: string;
    timestamp?: string;
    completed?: boolean;
  }>;
  topics: string[];
  speakerStats: Array<{
    speaker: string;
    talkTimeSeconds: number;
    percentage: number;
    wordCount: number;
  }>;
}

export const CURATED_YOUTUBE_TRANSCRIPTS: Record<string, CuratedYouTubeTranscript> = {
  UF8uR6Z6KLc: {
    videoId: 'UF8uR6Z6KLc',
    title: "Steve Jobs' 2005 Stanford Commencement Address",
    author: 'Stanford University',
    youtubeUrl: 'https://www.youtube.com/watch?v=UF8uR6Z6KLc',
    thumbnailUrl: 'https://i.ytimg.com/vi/UF8uR6Z6KLc/hqdefault.jpg',
    detectedLanguage: 'English',
    durationSeconds: 904,
    durationFormatted: '15:04',
    wordCount: 1450,
    paceWpm: 155,
    summary:
      'In his iconic 2005 Stanford commencement address, Steve Jobs shares three pivotal stories from his life: connecting the dots between dropping out of college and calligraphy classes that inspired typography on the Mac; love and loss after being fired from Apple and founding NeXT and Pixar; and his confrontation with mortality after a cancer diagnosis, urging graduates to pursue what they love and "Stay Hungry. Stay Foolish."',
    segments: [
      {
        id: 'sj_1',
        start: 0,
        end: 9.0,
        startTimeFormatted: '00:00',
        endTimeFormatted: '00:09',
        speaker: 'Steve Jobs',
        text: 'I am honored to be with you today at your commencement from one of the finest universities in the world.',
      },
      {
        id: 'sj_2',
        start: 9.5,
        end: 18.0,
        startTimeFormatted: '00:09',
        endTimeFormatted: '00:18',
        speaker: 'Steve Jobs',
        text: 'I never graduated from college. Truth be told, this is the closest I’ve ever gotten to a college graduation.',
      },
      {
        id: 'sj_3',
        start: 18.5,
        end: 28.0,
        startTimeFormatted: '00:18',
        endTimeFormatted: '00:28',
        speaker: 'Steve Jobs',
        text: 'Today I want to tell you three stories from my life. That’s it. No big deal. Just three stories.',
      },
      {
        id: 'sj_4',
        start: 28.5,
        end: 37.0,
        startTimeFormatted: '00:28',
        endTimeFormatted: '00:37',
        speaker: 'Steve Jobs',
        text: 'The first story is about connecting the dots. I dropped out of Reed College after the first six months, but then stayed around as a drop-in for another eighteen months.',
      },
      {
        id: 'sj_5',
        start: 37.5,
        end: 49.0,
        startTimeFormatted: '00:37',
        endTimeFormatted: '00:49',
        speaker: 'Steve Jobs',
        text: 'Reed College at that time offered perhaps the best calligraphy instruction in the country. I learned about serif and sans-serif typefaces, about varying the amount of space between different letter combinations.',
      },
      {
        id: 'sj_6',
        start: 49.5,
        end: 62.0,
        startTimeFormatted: '00:49',
        endTimeFormatted: '01:02',
        speaker: 'Steve Jobs',
        text: 'None of this had even a hope of any practical application in my life. But ten years later, when we were designing the first Macintosh computer, it all came back to me.',
      },
      {
        id: 'sj_7',
        start: 62.5,
        end: 75.0,
        startTimeFormatted: '01:02',
        endTimeFormatted: '01:15',
        speaker: 'Steve Jobs',
        text: 'And we designed it all into the Mac. It was the first computer with beautiful typography. If I had never dropped in on that single course, the Mac would have never had multiple typefaces or proportionally spaced fonts.',
      },
      {
        id: 'sj_8',
        start: 75.5,
        end: 88.0,
        startTimeFormatted: '01:15',
        endTimeFormatted: '01:28',
        speaker: 'Steve Jobs',
        text: 'You cannot connect the dots looking forward; you can only connect them looking backwards. So you have to trust that the dots will somehow connect in your future.',
      },
      {
        id: 'sj_9',
        start: 88.5,
        end: 102.0,
        startTimeFormatted: '01:28',
        endTimeFormatted: '01:42',
        speaker: 'Steve Jobs',
        text: 'You have to trust in something — your gut, destiny, life, karma, whatever. This approach has never let me down, and it has made all the difference in my life.',
      },
      {
        id: 'sj_10',
        start: 102.5,
        end: 118.0,
        startTimeFormatted: '01:42',
        endTimeFormatted: '01:58',
        speaker: 'Steve Jobs',
        text: 'My second story is about love and loss. I was lucky — I found what I loved to do early in life. Woz and I started Apple in my parents’ garage when I was twenty.',
      },
      {
        id: 'sj_11',
        start: 118.5,
        end: 132.0,
        startTimeFormatted: '01:58',
        endTimeFormatted: '02:12',
        speaker: 'Steve Jobs',
        text: 'In ten years Apple had grown from just the two of us into a two billion dollar company with over four thousand employees. And then I got fired.',
      },
      {
        id: 'sj_12',
        start: 132.5,
        end: 147.0,
        startTimeFormatted: '02:12',
        endTimeFormatted: '02:27',
        speaker: 'Steve Jobs',
        text: 'I didn’t see it then, but getting fired from Apple was the best thing that could have ever happened to me. The heaviness of being successful was replaced by the lightness of being a beginner again.',
      },
      {
        id: 'sj_13',
        start: 147.5,
        end: 162.0,
        startTimeFormatted: '02:27',
        endTimeFormatted: '02:42',
        speaker: 'Steve Jobs',
        text: 'During the next five years, I started a company named NeXT, another company named Pixar, and fell in love with an amazing woman who would become my wife.',
      },
      {
        id: 'sj_14',
        start: 162.5,
        end: 178.0,
        startTimeFormatted: '02:42',
        endTimeFormatted: '02:58',
        speaker: 'Steve Jobs',
        text: 'Pixar went on to create the world’s first computer-animated feature film, Toy Story, and is now the most successful animation studio in the world.',
      },
      {
        id: 'sj_15',
        start: 178.5,
        end: 195.0,
        startTimeFormatted: '02:58',
        endTimeFormatted: '03:15',
        speaker: 'Steve Jobs',
        text: 'In a remarkable turn of events, Apple bought NeXT, I returned to Apple, and the technology we developed at NeXT is at the heart of Apple’s current renaissance.',
      },
      {
        id: 'sj_16',
        start: 195.5,
        end: 210.0,
        startTimeFormatted: '03:15',
        endTimeFormatted: '03:30',
        speaker: 'Steve Jobs',
        text: 'Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. And the only way to do great work is to love what you do.',
      },
      {
        id: 'sj_17',
        start: 210.5,
        end: 226.0,
        startTimeFormatted: '03:30',
        endTimeFormatted: '03:46',
        speaker: 'Steve Jobs',
        text: 'If you haven’t found it yet, keep looking. Don’t settle. As with all matters of the heart, you’ll know when you find it.',
      },
      {
        id: 'sj_18',
        start: 226.5,
        end: 242.0,
        startTimeFormatted: '03:46',
        endTimeFormatted: '04:02',
        speaker: 'Steve Jobs',
        text: 'My third story is about death. When I was seventeen, I read a quote that went something like: "If you live each day as if it was your last, someday you’ll most certainly be right."',
      },
      {
        id: 'sj_19',
        start: 242.5,
        end: 258.0,
        startTimeFormatted: '04:02',
        endTimeFormatted: '04:18',
        speaker: 'Steve Jobs',
        text: 'Remembering that I’ll be dead soon is the most important tool I’ve ever encountered to help me make the big choices in life.',
      },
      {
        id: 'sj_20',
        start: 258.5,
        end: 275.0,
        startTimeFormatted: '04:18',
        endTimeFormatted: '04:35',
        speaker: 'Steve Jobs',
        text: 'Because almost everything — all external expectations, all pride, all fear of embarrassment or failure — these things just fall away in the face of death, leaving only what is truly important.',
      },
      {
        id: 'sj_21',
        start: 275.5,
        end: 290.0,
        startTimeFormatted: '04:35',
        endTimeFormatted: '04:50',
        speaker: 'Steve Jobs',
        text: 'Your time is limited, so don’t waste it living someone else’s life. Don’t be trapped by dogma — which is living with the results of other people’s thinking.',
      },
      {
        id: 'sj_22',
        start: 290.5,
        end: 306.0,
        startTimeFormatted: '04:50',
        endTimeFormatted: '05:06',
        speaker: 'Steve Jobs',
        text: 'Don’t let the noise of others’ opinions drown out your own inner voice. And most important, have the courage to follow your heart and intuition.',
      },
      {
        id: 'sj_23',
        start: 306.5,
        end: 325.0,
        startTimeFormatted: '05:06',
        endTimeFormatted: '05:25',
        speaker: 'Steve Jobs',
        text: 'Stay Hungry. Stay Foolish. Thank you all very much.',
      },
    ],
    fullText: `[00:00] Steve Jobs: I am honored to be with you today at your commencement from one of the finest universities in the world.

[00:09] Steve Jobs: I never graduated from college. Truth be told, this is the closest I’ve ever gotten to a college graduation.

[00:18] Steve Jobs: Today I want to tell you three stories from my life. That’s it. No big deal. Just three stories.

[00:28] Steve Jobs: The first story is about connecting the dots. I dropped out of Reed College after the first six months, but then stayed around as a drop-in for another eighteen months.

[00:37] Steve Jobs: Reed College at that time offered perhaps the best calligraphy instruction in the country. I learned about serif and sans-serif typefaces, about varying the amount of space between different letter combinations.

[01:02] Steve Jobs: And we designed it all into the Mac. It was the first computer with beautiful typography. If I had never dropped in on that single course, the Mac would have never had multiple typefaces or proportionally spaced fonts.

[01:15] Steve Jobs: You cannot connect the dots looking forward; you can only connect them looking backwards. So you have to trust that the dots will somehow connect in your future.

[01:28] Steve Jobs: You have to trust in something — your gut, destiny, life, karma, whatever. This approach has never let me down, and it has made all the difference in my life.

[01:42] Steve Jobs: My second story is about love and loss. I was lucky — I found what I loved to do early in life. Woz and I started Apple in my parents’ garage when I was twenty.

[01:58] Steve Jobs: In ten years Apple had grown from just the two of us into a two billion dollar company with over four thousand employees. And then I got fired.

[02:12] Steve Jobs: I didn’t see it then, but getting fired from Apple was the best thing that could have ever happened to me. The heaviness of being successful was replaced by the lightness of being a beginner again.

[02:27] Steve Jobs: During the next five years, I started a company named NeXT, another company named Pixar, and fell in love with an amazing woman who would become my wife.

[02:58] Steve Jobs: In a remarkable turn of events, Apple bought NeXT, I returned to Apple, and the technology we developed at NeXT is at the heart of Apple’s current renaissance.

[03:15] Steve Jobs: Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. And the only way to do great work is to love what you do.

[03:30] Steve Jobs: If you haven’t found it yet, keep looking. Don’t settle. As with all matters of the heart, you’ll know when you find it.

[03:46] Steve Jobs: My third story is about death. Remembering that I’ll be dead soon is the most important tool I’ve ever encountered to help me make the big choices in life.

[04:35] Steve Jobs: Your time is limited, so don’t waste it living someone else’s life. Don’t be trapped by dogma — which is living with the results of other people’s thinking.

[04:50] Steve Jobs: Don’t let the noise of others’ opinions drown out your own inner voice. And most important, have the courage to follow your heart and intuition.

[05:06] Steve Jobs: Stay Hungry. Stay Foolish. Thank you all very much.`,
    chapters: [
      {
        title: 'Story 1: Connecting the Dots',
        startTime: 28,
        startTimeFormatted: '00:28',
        description: 'Dropping out of Reed, learning calligraphy, and typography on the Macintosh.',
      },
      {
        title: 'Story 2: Love and Loss',
        startTime: 102,
        startTimeFormatted: '01:42',
        description: 'Getting fired from Apple, founding NeXT and Pixar, and returning to lead Apple.',
      },
      {
        title: 'Story 3: Death and Mortality',
        startTime: 226,
        startTimeFormatted: '03:46',
        description: 'Facing a cancer diagnosis, valuing limited time, and following your heart.',
      },
      {
        title: 'Conclusion: Stay Hungry, Stay Foolish',
        startTime: 306,
        startTimeFormatted: '05:06',
        description: 'Final blessing and inspiration to the graduating class.',
      },
    ],
    keyTakeaways: [
      'You cannot connect the dots looking forward; you can only connect them looking backwards. Trust your intuition.',
      'Getting fired from Apple was a blessing in disguise that unlocked NeXT, Pixar, and creative freedom.',
      'The only way to do great work is to love what you do. If you haven’t found it yet, keep looking and don’t settle.',
      'Death is the destination we all share. Your time is limited, so don’t waste it living someone else’s life.',
    ],
    actionItems: [
      {
        id: 'act_sj_1',
        task: 'Identify your true passions and do not settle for work that lacks meaning',
        owner: 'Graduates',
        timestamp: '03:15',
        completed: false,
      },
      {
        id: 'act_sj_2',
        task: 'Trust your intuition and inner voice rather than being trapped by external dogma',
        owner: 'Everyone',
        timestamp: '04:50',
        completed: true,
      },
    ],
    topics: ['Leadership', 'Creativity', 'Life Advice', 'Technology History', 'Personal Growth'],
    speakerStats: [
      {
        speaker: 'Steve Jobs',
        talkTimeSeconds: 325,
        percentage: 100,
        wordCount: 1450,
      },
    ],
  },
  Y2F848jKeDc: {
    videoId: 'Y2F848jKeDc',
    title: 'Jensen Huang GTC Keynote Vision',
    author: 'NVIDIA',
    youtubeUrl: 'https://www.youtube.com/watch?v=Y2F848jKeDc',
    thumbnailUrl: 'https://i.ytimg.com/vi/Y2F848jKeDc/hqdefault.jpg',
    detectedLanguage: 'English',
    durationSeconds: 720,
    durationFormatted: '12:00',
    wordCount: 1200,
    paceWpm: 160,
    summary:
      'Jensen Huang presents NVIDIA’s architectural roadmap for accelerated computing, Blackwell ultra-scale GPUs, and the transition from retrieval-based computing to generative AI factories powering global physical and digital infrastructure.',
    segments: [
      {
        id: 'jh_1',
        start: 0,
        end: 12.0,
        startTimeFormatted: '00:00',
        endTimeFormatted: '00:12',
        speaker: 'Jensen Huang',
        text: 'Welcome to GTC. Today, we are at the beginning of a brand-new industrial revolution.',
      },
      {
        id: 'jh_2',
        start: 12.5,
        end: 26.0,
        startTimeFormatted: '00:12',
        endTimeFormatted: '00:26',
        speaker: 'Jensen Huang',
        text: 'General-purpose computing has run out of steam. We need accelerated computing to continue driving down costs and energy consumption while scaling intelligence.',
      },
      {
        id: 'jh_3',
        start: 26.5,
        end: 42.0,
        startTimeFormatted: '00:26',
        endTimeFormatted: '00:42',
        speaker: 'Jensen Huang',
        text: 'Blackwell is not just a chip; it is an entire computational platform. Two hundred and eight billion transistors connected by a ten terabyte per second link.',
      },
      {
        id: 'jh_4',
        start: 42.5,
        end: 58.0,
        startTimeFormatted: '00:42',
        endTimeFormatted: '00:58',
        speaker: 'Jensen Huang',
        text: 'We are creating AI factories. Just as AC power was generated in the last century, digital intelligence is now manufactured and distributed worldwide.',
      },
    ],
    fullText: `[00:00] Jensen Huang: Welcome to GTC. Today, we are at the beginning of a brand-new industrial revolution.

[00:12] Jensen Huang: General-purpose computing has run out of steam. We need accelerated computing to continue driving down costs and energy consumption while scaling intelligence.

[00:26] Jensen Huang: Blackwell is not just a chip; it is an entire computational platform. Two hundred and eight billion transistors connected by a ten terabyte per second link.

[00:42] Jensen Huang: We are creating AI factories. Just as AC power was generated in the last century, digital intelligence is now manufactured and distributed worldwide.`,
    chapters: [
      {
        title: 'The New Industrial Revolution',
        startTime: 0,
        startTimeFormatted: '00:00',
        description: 'End of general computing and dawn of AI factories.',
      },
      {
        title: 'Blackwell Architecture',
        startTime: 26,
        startTimeFormatted: '00:26',
        description: '208B transistors and scale-up cluster computing.',
      },
    ],
    keyTakeaways: [
      'Accelerated computing reduces datacenter energy while delivering 30x faster inference.',
      'Blackwell connects massive dual-die GPUs as a single unified superchip.',
      'AI factories are becoming the foundational utility of modern enterprise.',
    ],
    actionItems: [
      {
        id: 'act_jh_1',
        task: 'Evaluate accelerated compute migration for legacy server workloads',
        owner: 'Infrastructure Engineering',
        timestamp: '00:12',
        completed: false,
      },
    ],
    topics: ['Accelerated Computing', 'Semiconductors', 'AI Infrastructure', 'Blackwell GPU'],
    speakerStats: [
      {
        speaker: 'Jensen Huang',
        talkTimeSeconds: 58,
        percentage: 100,
        wordCount: 120,
      },
    ],
  },
  'd_kOwrk-uQU': {
    videoId: 'd_kOwrk-uQU',
    title: 'Sam Altman on AI & Compute Future',
    author: 'Y Combinator',
    youtubeUrl: 'https://www.youtube.com/watch?v=d_kOwrk-uQU',
    thumbnailUrl: 'https://i.ytimg.com/vi/d_kOwrk-uQU/hqdefault.jpg',
    detectedLanguage: 'English',
    durationSeconds: 660,
    durationFormatted: '11:00',
    wordCount: 1100,
    paceWpm: 150,
    summary:
      'Sam Altman discusses the compounding trajectory of foundation models, reasoning compute budgets, agentic workflows, and the strategic importance of energy and datacenter infrastructure.',
    segments: [
      {
        id: 'sa_1',
        start: 0,
        end: 15.0,
        startTimeFormatted: '00:00',
        endTimeFormatted: '00:15',
        speaker: 'Sam Altman',
        text: 'The most important thing for founders today is to bet on the continued steep exponent of artificial intelligence.',
      },
      {
        id: 'sa_2',
        start: 15.5,
        end: 30.0,
        startTimeFormatted: '00:15',
        endTimeFormatted: '00:30',
        speaker: 'Sam Altman',
        text: 'Models that reason at test time are opening entirely new domains in scientific discovery, software development, and robotics.',
      },
      {
        id: 'sa_3',
        start: 30.5,
        end: 48.0,
        startTimeFormatted: '00:30',
        endTimeFormatted: '00:48',
        speaker: 'Sam Altman',
        text: 'The gating factors in the next decade are energy and compute. Teams that secure clean power and compute capacity will build the defining platforms.',
      },
    ],
    fullText: `[00:00] Sam Altman: The most important thing for founders today is to bet on the continued steep exponent of artificial intelligence.

[00:15] Sam Altman: Models that reason at test time are opening entirely new domains in scientific discovery, software development, and robotics.

[00:30] Sam Altman: The gating factors in the next decade are energy and compute. Teams that secure clean power and compute capacity will build the defining platforms.`,
    chapters: [
      {
        title: 'The AI Exponent',
        startTime: 0,
        startTimeFormatted: '00:00',
        description: 'Compounding model capabilities and founder strategy.',
      },
      {
        title: 'Energy & Compute Constraints',
        startTime: 30,
        startTimeFormatted: '00:30',
        description: 'Datacenter scaling, power grids, and next-gen infrastructure.',
      },
    ],
    keyTakeaways: [
      'Founders should design products assuming models will be drastically smarter every year.',
      'Test-time reasoning unlocks complex autonomous agent workflows.',
      'Energy and compute supply chains are the primary scaling bottlenecks.',
    ],
    actionItems: [
      {
        id: 'act_sa_1',
        task: 'Audit AI application architecture for reasoning model integration',
        owner: 'Product Team',
        timestamp: '00:15',
        completed: false,
      },
    ],
    topics: ['AI Scaling', 'Venture Capital', 'Compute Infrastructure', 'Agents'],
    speakerStats: [
      {
        speaker: 'Sam Altman',
        talkTimeSeconds: 48,
        percentage: 100,
        wordCount: 110,
      },
    ],
  },
};
