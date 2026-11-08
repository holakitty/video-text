import { SampleMediaItem } from '../types/transcript';

export const SAMPLE_MEDIA_LIST: SampleMediaItem[] = [
  {
    id: 'sample-en-keynote',
    title: 'Next-Gen AI & Spatial Computing Keynote',
    language: 'English',
    languageCode: 'en',
    duration: '01:15',
    durationSeconds: 75,
    speakerCount: 2,
    category: 'Technology & AI',
    mediaType: 'video',
    description: 'An inspiring developer keynote presentation exploring multimodal reasoning models, edge computing, and real-time spatial interfaces.',
    sampleTranscript: {
      id: 'sample-en-keynote',
      title: 'Next-Gen AI & Spatial Computing Keynote',
      fileName: 'keynote_spatial_ai_2026.mp4',
      createdAt: new Date().toISOString(),
      mediaType: 'video',
      detectedLanguage: 'English',
      selectedInputLanguage: 'en',
      durationSeconds: 75,
      durationFormatted: '01:15',
      wordCount: 198,
      paceWpm: 158,
      summary: 'Dr. Elena Vance and Marcus Chen unveil the next evolution of spatial computing integrated with multimodal AI intelligence. They demonstrate real-time contextual awareness, zero-latency local audio transcription, and seamless gesture navigation designed to transform remote engineering collaboration.',
      segments: [
        {
          id: 'seg_1',
          start: 0,
          end: 6.5,
          startTimeFormatted: '00:00',
          endTimeFormatted: '00:06',
          speaker: 'Dr. Elena Vance',
          text: 'Good morning everyone, and welcome to this year’s Spatial Intelligence summit.',
        },
        {
          id: 'seg_2',
          start: 7.0,
          end: 14.8,
          startTimeFormatted: '00:07',
          endTimeFormatted: '00:14',
          speaker: 'Dr. Elena Vance',
          text: 'Today, we are bridging the physical and digital boundaries with on-device multimodal reasoning and instant voice comprehension.',
        },
        {
          id: 'seg_3',
          start: 15.2,
          end: 22.0,
          startTimeFormatted: '00:15',
          endTimeFormatted: '00:22',
          speaker: 'Marcus Chen',
          text: 'Thanks Elena. What you are seeing right now on screen is a live feed being processed at sub-twenty millisecond latency.',
        },
        {
          id: 'seg_4',
          start: 22.5,
          end: 32.0,
          startTimeFormatted: '00:22',
          endTimeFormatted: '00:32',
          speaker: 'Marcus Chen',
          text: 'Every spoken phoneme, visual gesture, and spatial depth point is harmonized into unified semantic tokens that any application can query.',
        },
        {
          id: 'seg_5',
          start: 32.5,
          end: 43.8,
          startTimeFormatted: '00:32',
          endTimeFormatted: '00:43',
          speaker: 'Dr. Elena Vance',
          text: 'Notice how the transcript automatically tracks the speaker switch between Marcus and myself, aligning exact microsecond timestamps with the visual video feed.',
        },
        {
          id: 'seg_6',
          start: 44.2,
          end: 54.0,
          startTimeFormatted: '00:44',
          endTimeFormatted: '00:54',
          speaker: 'Marcus Chen',
          text: 'And because this operates seamlessly across thirty different world languages, distributed engineering teams can collaborate with zero language friction.',
        },
        {
          id: 'seg_7',
          start: 54.5,
          end: 64.0,
          startTimeFormatted: '00:54',
          endTimeFormatted: '01:04',
          speaker: 'Dr. Elena Vance',
          text: 'We are open-sourcing the client synchronization SDK today, so you can embed interactive video transcripts directly into your workflow.',
        },
        {
          id: 'seg_8',
          start: 64.5,
          end: 75.0,
          startTimeFormatted: '01:04',
          endTimeFormatted: '01:15',
          speaker: 'Marcus Chen',
          text: 'Let’s jump straight into the developer sandbox and see how fast you can turn raw video into searchable intelligence.',
        },
      ],
      fullText: `[00:00] Dr. Elena Vance: Good morning everyone, and welcome to this year’s Spatial Intelligence summit.

[00:07] Dr. Elena Vance: Today, we are bridging the physical and digital boundaries with on-device multimodal reasoning and instant voice comprehension.

[00:15] Marcus Chen: Thanks Elena. What you are seeing right now on screen is a live feed being processed at sub-twenty millisecond latency.

[00:22] Marcus Chen: Every spoken phoneme, visual gesture, and spatial depth point is harmonized into unified semantic tokens that any application can query.

[00:32] Dr. Elena Vance: Notice how the transcript automatically tracks the speaker switch between Marcus and myself, aligning exact microsecond timestamps with the visual video feed.

[00:44] Marcus Chen: And because this operates seamlessly across thirty different world languages, distributed engineering teams can collaborate with zero language friction.

[00:54] Dr. Elena Vance: We are open-sourcing the client synchronization SDK today, so you can embed interactive video transcripts directly into your workflow.

[01:04] Marcus Chen: Let’s jump straight into the developer sandbox and see how fast you can turn raw video into searchable intelligence.`,
      chapters: [
        {
          title: 'Opening & Vision',
          startTime: 0,
          startTimeFormatted: '00:00',
          description: 'Introduction to Spatial Intelligence and multimodal audio reasoning.',
        },
        {
          title: 'Live Telemetry & Latency',
          startTime: 15,
          startTimeFormatted: '00:15',
          description: 'Demonstrating sub-20ms real-time token processing.',
        },
        {
          title: 'Speaker Diarization & Global Languages',
          startTime: 32,
          startTimeFormatted: '00:32',
          description: 'Multilingual speaker tracking across 30+ languages.',
        },
        {
          title: 'SDK Release & Sandbox',
          startTime: 54,
          startTimeFormatted: '00:54',
          description: 'Open-source SDK announcement and developer next steps.',
        },
      ],
      keyTakeaways: [
        'Multimodal processing operates with sub-20ms latency across audio, visual, and depth streams.',
        'Automatic speaker diarization accurately distinguishes speakers and aligns microsecond timestamps.',
        'Complete support for over 30 world languages eliminates cross-border collaboration barriers.',
        'The synchronization SDK is released for developers to embed searchable video transcripts immediately.',
      ],
      actionItems: [
        {
          id: 'act_1',
          task: 'Download and test the open-source client synchronization SDK',
          owner: 'Developer Team',
          timestamp: '00:54',
          completed: false,
        },
        {
          id: 'act_2',
          task: 'Review telemetry latency benchmarks in the developer sandbox',
          owner: 'Marcus Chen',
          timestamp: '01:04',
          completed: false,
        },
        {
          id: 'act_3',
          task: 'Configure multilingual localization pipeline for distributed hubs',
          owner: 'Localization Lead',
          timestamp: '00:44',
          completed: true,
        },
      ],
      topics: ['Spatial Computing', 'Multimodal AI', 'Speech-to-Text', 'Developer Tools', 'Low Latency'],
      speakerStats: [
        {
          speaker: 'Dr. Elena Vance',
          talkTimeSeconds: 38,
          percentage: 51,
          wordCount: 104,
        },
        {
          speaker: 'Marcus Chen',
          talkTimeSeconds: 37,
          percentage: 49,
          wordCount: 94,
        },
      ],
    },
  },
  {
    id: 'sample-es-talk',
    title: 'Innovación y Sostenibilidad Global',
    language: 'Spanish',
    languageCode: 'es',
    duration: '01:05',
    durationSeconds: 65,
    speakerCount: 2,
    category: 'Sostenibilidad y Energía',
    mediaType: 'video',
    description: 'Conferencia sobre transición energética, redes eléctricas inteligentes y tecnologías descarbonizadas en Iberoamérica.',
    sampleTranscript: {
      id: 'sample-es-talk',
      title: 'Innovación y Sostenibilidad Global',
      fileName: 'sostenibilidad_innovacion_2026.mp4',
      createdAt: new Date().toISOString(),
      mediaType: 'video',
      detectedLanguage: 'Spanish',
      selectedInputLanguage: 'es',
      durationSeconds: 65,
      durationFormatted: '01:05',
      wordCount: 165,
      paceWpm: 152,
      summary: 'La Ingeniera Sofía Morales y el Director Carlos Méndez exponen los avances en almacenamiento de energía solar y eólica mediante baterías de flujo redox. Destacan la reducción del 40% en costos de infraestructura para ciudades intermedias.',
      segments: [
        {
          id: 'es_1',
          start: 0,
          end: 7.2,
          startTimeFormatted: '00:00',
          endTimeFormatted: '00:07',
          speaker: 'Ing. Sofía Morales',
          text: 'Bienvenidos a todos al foro iberoamericano sobre transición energética y ciudades sostenibles.',
        },
        {
          id: 'es_2',
          start: 7.8,
          end: 16.5,
          startTimeFormatted: '00:07',
          endTimeFormatted: '00:16',
          speaker: 'Ing. Sofía Morales',
          text: 'Hoy presentamos los resultados de tres años de pruebas piloto con sistemas descentralizados de microrredes solares.',
        },
        {
          id: 'es_3',
          start: 17.0,
          end: 25.2,
          startTimeFormatted: '00:17',
          endTimeFormatted: '00:25',
          speaker: 'Carlos Méndez',
          text: 'Efectivamente Sofía. Lo más destacable ha sido la estabilidad de las baterías de flujo redox durante picos de demanda.',
        },
        {
          id: 'es_4',
          start: 25.8,
          end: 35.0,
          startTimeFormatted: '00:25',
          endTimeFormatted: '00:35',
          speaker: 'Carlos Méndez',
          text: 'Logramos una reducción neta del cuarenta por ciento en costos de mantenimiento comparado con soluciones convencionales.',
        },
        {
          id: 'es_5',
          start: 35.5,
          end: 45.0,
          startTimeFormatted: '00:35',
          endTimeFormatted: '00:45',
          speaker: 'Ing. Sofía Morales',
          text: 'Además, la digitalización de la red permite a los municipios predecir patrones de consumo con algoritmos de alta precisión.',
        },
        {
          id: 'es_6',
          start: 45.5,
          end: 55.0,
          startTimeFormatted: '00:45',
          endTimeFormatted: '00:55',
          speaker: 'Carlos Méndez',
          text: 'El siguiente paso es expandir este modelo a doce nuevas comunidades antes de finalizar el cuarto trimestre del año.',
        },
        {
          id: 'es_7',
          start: 55.5,
          end: 65.0,
          startTimeFormatted: '00:55',
          endTimeFormatted: '01:05',
          speaker: 'Ing. Sofía Morales',
          text: 'Agradecemos a todos nuestros colaboradores y abrimos el panel para preguntas técnicas del público.',
        },
      ],
      fullText: `[00:00] Ing. Sofía Morales: Bienvenidos a todos al foro iberoamericano sobre transición energética y ciudades sostenibles.

[00:07] Ing. Sofía Morales: Hoy presentamos los resultados de tres años de pruebas piloto con sistemas descentralizados de microrredes solares.

[00:17] Carlos Méndez: Efectivamente Sofía. Lo más destacable ha sido la estabilidad de las baterías de flujo redox durante picos de demanda.

[00:25] Carlos Méndez: Logramos una reducción neta del cuarenta por ciento en costos de mantenimiento comparado con soluciones convencionales.

[00:35] Ing. Sofía Morales: Además, la digitalización de la red permite a los municipios predecir patrones de consumo con algoritmos de alta precisión.

[00:45] Carlos Méndez: El siguiente paso es expandir este modelo a doce nuevas comunidades antes de finalizar el cuarto trimestre del año.

[00:55] Ing. Sofía Morales: Agradecemos a todos nuestros colaboradores y abrimos el panel para preguntas técnicas del público.`,
      chapters: [
        {
          title: 'Introducción y Contexto',
          startTime: 0,
          startTimeFormatted: '00:00',
          description: 'Apertura del foro sobre transición energética.',
        },
        {
          title: 'Rendimiento de Microrredes',
          startTime: 17,
          startTimeFormatted: '00:17',
          description: 'Baterías redox y reducción de costos operativos.',
        },
        {
          title: 'Predicción y Expansión',
          startTime: 35,
          startTimeFormatted: '00:35',
          description: 'Algoritmos de consumo y despliegue en 12 comunidades.',
        },
      ],
      keyTakeaways: [
        'Reducción del 40% en costos de mantenimiento gracias a baterías de flujo redox.',
        'Predicción de demanda energética municipal mediante algoritmos inteligentes.',
        'Expansión planificada a 12 nuevas comunidades durante el cuarto trimestre.',
      ],
      actionItems: [
        {
          id: 'act_es_1',
          task: 'Publicar el informe técnico de la prueba piloto de 3 años',
          owner: 'Ing. Sofía Morales',
          timestamp: '00:07',
          completed: true,
        },
        {
          id: 'act_es_2',
          task: 'Coordinar con autoridades locales el despliegue en las 12 comunidades',
          owner: 'Carlos Méndez',
          timestamp: '00:45',
          completed: false,
        },
      ],
      topics: ['Energía Solar', 'Sostenibilidad', 'Microrredes', 'Innovación'],
      speakerStats: [
        {
          speaker: 'Ing. Sofía Morales',
          talkTimeSeconds: 35,
          percentage: 54,
          wordCount: 88,
        },
        {
          speaker: 'Carlos Méndez',
          talkTimeSeconds: 30,
          percentage: 46,
          wordCount: 77,
        },
      ],
    },
  },
  {
    id: 'sample-ja-robotics',
    title: '次世代ロボティクスと自動化技術',
    language: 'Japanese',
    languageCode: 'ja',
    duration: '01:00',
    durationSeconds: 60,
    speakerCount: 2,
    category: '工学とロボット',
    mediaType: 'video',
    description: '協働ロボットの触覚センサー技術と精密組み立てラインの自動化に関する技術プレゼンテーション。',
    sampleTranscript: {
      id: 'sample-ja-robotics',
      title: '次世代ロボティクスと自動化技術',
      fileName: 'robotics_symposium_tokyo.mp4',
      createdAt: new Date().toISOString(),
      mediaType: 'video',
      detectedLanguage: 'Japanese',
      selectedInputLanguage: 'ja',
      durationSeconds: 60,
      durationFormatted: '01:00',
      wordCount: 142,
      paceWpm: 142,
      summary: '佐藤博士と高橋エンジニアによる高精度触覚センサーを搭載した協働ロボットのデモンストレーション。微小部品の組み立てにおいて、人間の指先と同等の力加減制御を実現しました。',
      segments: [
        {
          id: 'ja_1',
          start: 0,
          end: 7.5,
          startTimeFormatted: '00:00',
          endTimeFormatted: '00:07',
          speaker: '佐藤博士 (Dr. Sato)',
          text: '皆様、本日は先端ロボティクス・シンポジウムにお越しいただき誠にありがとうございます。',
        },
        {
          id: 'ja_2',
          start: 8.0,
          end: 18.2,
          startTimeFormatted: '00:08',
          endTimeFormatted: '00:18',
          speaker: '佐藤博士 (Dr. Sato)',
          text: '今回の研究では、ミリ秒単位でフィードバックを行う新開発の触覚センサーをご紹介します。',
        },
        {
          id: 'ja_3',
          start: 19.0,
          end: 29.5,
          startTimeFormatted: '00:19',
          endTimeFormatted: '00:29',
          speaker: '高橋エンジニア',
          text: 'こちらのモニターをご覧ください。ガラス素材のマイクロレンズを傷つけることなく、正確に嵌合しています。',
        },
        {
          id: 'ja_4',
          start: 30.0,
          end: 41.5,
          startTimeFormatted: '00:30',
          endTimeFormatted: '00:41',
          speaker: '高橋エンジニア',
          text: 'センサーの感度はゼロコンマ一ニュートンまで感知可能で、作業員の安全停止機能も同時に作動します。',
        },
        {
          id: 'ja_5',
          start: 42.0,
          end: 51.0,
          startTimeFormatted: '00:42',
          endTimeFormatted: '00:51',
          speaker: '佐藤博士 (Dr. Sato)',
          text: '来春より自動車および半導体製造ラインへの本格導入を予定しております。',
        },
        {
          id: 'ja_6',
          start: 51.5,
          end: 60.0,
          startTimeFormatted: '00:51',
          endTimeFormatted: '01:00',
          speaker: '高橋エンジニア',
          text: 'それでは、実機の動作デモンストレーションを開始いたします。',
        },
      ],
      fullText: `[00:00] 佐藤博士 (Dr. Sato): 皆様、本日は先端ロボティクス・シンポジウムにお越しいただき誠にありがとうございます。

[00:08] 佐藤博士 (Dr. Sato): 今回の研究では、ミリ秒単位でフィードバックを行う新開発の触覚センサーをご紹介します。

[00:19] 高橋エンジニア: こちらのモニターをご覧ください。ガラス素材のマイクロレンズを傷つけることなく、正確に嵌合しています。

[00:30] 高橋エンジニア: センサーの感度はゼロコンマ一ニュートンまで感知可能で、作業員の安全停止機能も同時に作動します。

[00:42] 佐藤博士 (Dr. Sato): 来春より自動車および半導体製造ラインへの本格導入を予定しております。

[00:51] 高橋エンジニア: それでは、実機の動作デモンストレーションを開始いたします。`,
      chapters: [
        {
          title: '開会と触覚センサー技術',
          startTime: 0,
          startTimeFormatted: '00:00',
          description: '新開発ミリ秒フィードバック触覚センサーの紹介。',
        },
        {
          title: 'マイクロレンズ組み立ての実証',
          startTime: 19,
          startTimeFormatted: '00:19',
          description: '0.1N単位の高精度力加減と安全停止制御。',
        },
        {
          title: '産業導入計画と実機デモ',
          startTime: 42,
          startTimeFormatted: '00:42',
          description: '来春の半導体・自動車ライン導入と実演。',
        },
      ],
      keyTakeaways: [
        '0.1Nまで感知可能な超高感度触覚センサーにより、微細部品の精密組み立てを実現。',
        '作業員と協働するためのミリ秒単位の即時安全停止機能を統合。',
        '来春より自動車および半導体製造ラインへの本格導入を開始。',
      ],
      actionItems: [
        {
          id: 'act_ja_1',
          task: '製造ライン向け安全認証レポートの提出',
          owner: '佐藤博士',
          timestamp: '00:42',
          completed: false,
        },
        {
          id: 'act_ja_2',
          task: '実機テストベッドでの耐久性評価試験の完了',
          owner: '高橋エンジニア',
          timestamp: '00:51',
          completed: true,
        },
      ],
      topics: ['ロボティクス', '触覚センサー', '半導体製造', '自動化技術'],
      speakerStats: [
        {
          speaker: '佐藤博士 (Dr. Sato)',
          talkTimeSeconds: 27,
          percentage: 45,
          wordCount: 65,
        },
        {
          speaker: '高橋エンジニア',
          talkTimeSeconds: 33,
          percentage: 55,
          wordCount: 77,
        },
      ],
    },
  },
  {
    id: 'sample-fr-energy',
    title: "L'Avenir de l'Énergie Renouvelable",
    language: 'French',
    languageCode: 'fr',
    duration: '00:55',
    durationSeconds: 55,
    speakerCount: 2,
    category: 'Écologie & Innovation',
    mediaType: 'video',
    description: "Table ronde sur le déploiement de l'hydrogène vert et des parcs éoliens offshore en Europe occidentale.",
    sampleTranscript: {
      id: 'sample-fr-energy',
      title: "L'Avenir de l'Énergie Renouvelable",
      fileName: 'energie_renouvelable_paris.mp4',
      createdAt: new Date().toISOString(),
      mediaType: 'video',
      detectedLanguage: 'French',
      selectedInputLanguage: 'fr',
      durationSeconds: 55,
      durationFormatted: '00:55',
      wordCount: 138,
      paceWpm: 150,
      summary: "Claire Dupont et Thomas Mercier présentent la stratégie européenne d'électrolyseurs pour l'hydrogène vert et les interconnexions d'énergie éolienne en mer du Nord.",
      segments: [
        {
          id: 'fr_1',
          start: 0,
          end: 6.8,
          startTimeFormatted: '00:00',
          endTimeFormatted: '00:06',
          speaker: 'Claire Dupont',
          text: 'Bonjour à toutes et à tous, ravis de vous retrouver pour ce point stratégique sur les énergies propres.',
        },
        {
          id: 'fr_2',
          start: 7.2,
          end: 15.5,
          startTimeFormatted: '00:07',
          endTimeFormatted: '00:15',
          speaker: 'Claire Dupont',
          text: "Cette année, la capacité installée en éolien offshore en mer du Nord a dépassé tous nos objectifs prévisionnels.",
        },
        {
          id: 'fr_3',
          start: 16.0,
          end: 25.0,
          startTimeFormatted: '00:16',
          endTimeFormatted: '00:25',
          speaker: 'Thomas Mercier',
          text: "Absolument Claire. Et le couplage direct avec nos électrolyseurs d'hydrogène vert permet d'éliminer totalement le gaspillage lors des surplus.",
        },
        {
          id: 'fr_4',
          start: 25.5,
          end: 35.5,
          startTimeFormatted: '00:25',
          endTimeFormatted: '00:35',
          speaker: 'Thomas Mercier',
          text: "Le rendement global atteint désormais soixante-huit pour cent, ce qui rend cette filière compétitive face aux énergies fossiles.",
        },
        {
          id: 'fr_5',
          start: 36.0,
          end: 46.0,
          startTimeFormatted: '00:36',
          endTimeFormatted: '00:46',
          speaker: 'Claire Dupont',
          text: "Nous préparons le raccordement de deux gigawatts supplémentaires d'ici le printemps prochain.",
        },
        {
          id: 'fr_6',
          start: 46.5,
          end: 55.0,
          startTimeFormatted: '00:46',
          endTimeFormatted: '00:55',
          speaker: 'Thomas Mercier',
          text: 'Passons maintenant aux détails techniques de la distribution portuaire.',
        },
      ],
      fullText: `[00:00] Claire Dupont: Bonjour à toutes et à tous, ravis de vous retrouver pour ce point stratégique sur les énergies propres.

[00:07] Claire Dupont: Cette année, la capacité installée en éolien offshore en mer du Nord a dépassé tous nos objectifs prévisionnels.

[00:16] Thomas Mercier: Absolument Claire. Et le couplage direct avec nos électrolyseurs d'hydrogène vert permet d'éliminer totalement le gaspillage lors des surplus.

[00:25] Thomas Mercier: Le rendement global atteint désormais soixante-huit pour cent, ce qui rend cette filière compétitive face aux énergies fossiles.

[00:36] Claire Dupont: Nous préparons le raccordement de deux gigawatts supplémentaires d'ici le printemps prochain.

[00:46] Thomas Mercier: Passons maintenant aux détails techniques de la distribution portuaire.`,
      chapters: [
        {
          title: 'Introduction et Éolien Offshore',
          startTime: 0,
          startTimeFormatted: '00:00',
          description: 'Bilan de la capacité installée en mer du Nord.',
        },
        {
          title: 'Hydrogène Vert et Rendement',
          startTime: 16,
          startTimeFormatted: '00:16',
          description: 'Électrolyseurs et rendement de 68%.',
        },
        {
          title: 'Raccordement de 2 GW',
          startTime: 36,
          startTimeFormatted: '00:36',
          description: 'Planning pour le printemps prochain.',
        },
      ],
      keyTakeaways: [
        "Capacité record atteinte pour l'éolien offshore en mer du Nord.",
        "Le couplage avec l'hydrogène vert atteint 68% de rendement global.",
        "Raccordement de 2 gigawatts supplémentaires prévu au printemps.",
      ],
      actionItems: [
        {
          id: 'act_fr_1',
          task: "Finaliser les contrats de raccordement pour les 2 GW",
          owner: 'Claire Dupont',
          timestamp: '00:36',
          completed: false,
        },
      ],
      topics: ['Énergie Propre', 'Éolien', 'Hydrogène Vert', 'Transition Écologique'],
      speakerStats: [
        {
          speaker: 'Claire Dupont',
          talkTimeSeconds: 26,
          percentage: 47,
          wordCount: 65,
        },
        {
          speaker: 'Thomas Mercier',
          talkTimeSeconds: 29,
          percentage: 53,
          wordCount: 73,
        },
      ],
    },
  },
];
