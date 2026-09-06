import { Service, signal } from '@angular/core';

export type Lang = 'sr' | 'en';

const STORAGE_KEY = 'dna-sim-lang';

type TranslationKey = string;
type Translations = Record<TranslationKey, string>;

const SR: Translations = {
  // Nav
  'nav.home': 'Početna',
  'nav.simulator': 'Simulator',
  'nav.about': 'O projektu',
  'nav.launch': 'Pokreni simulator →',

  // Home - hero
  'home.badge': 'Diplomski rad · MEAN Stack',
  'home.title1': 'Skladištenje podataka u DNK',
  'home.title2': 'Simulator',
  'home.desc':
    'Enkodiraj digitalne podatke u sintetičke DNK sekvence. Simuliraj greške koje se javljaju u realnim sistemima. Primeni mehanizme oporavka. Vizualizuj svaki korak procesa.',
  'home.cta.launch': 'Pokreni simulator →',
  'home.cta.learnMore': 'Saznaj više',
  'home.stats.errorTypes': 'Tipova grešaka',
  'home.stats.dnaBases': 'DNK baze',
  'home.stats.perBase': 'po bazi',

  // Home - how it works
  'home.how.title': 'Kako funkcioniše',
  'home.how.subtitle': 'Trostepeni proces koji modeluje ceo životni ciklus skladištenja u DNK',
  'home.how.encode.title': 'Enkodiranje',
  'home.how.encode.desc':
    'Tekst se konvertuje u binarni zapis (ASCII), a svaki par bitova se mapira na DNK bazu. Svaki karakter postaje niz od 4 baze.',
  'home.how.errors.title': 'Simulacija grešaka',
  'home.how.errors.desc':
    'Unosimo realistične greške skladištenja u DNK: supstitucije, insercije, delecije, grupne (burst) greške i gubitak sekvenci.',
  'home.how.recover.title': 'Oporavak',
  'home.how.recover.desc':
    'Primenjujemo detekciju i korekciju grešaka. Analiziramo stopu oporavka, upoređujemo originalne i oporavljene sekvence i pregledamo statistiku.',
  'home.how.recover.rateLabel': 'Stopa oporavka',

  // Home - base encoding
  'home.bases.title': 'DNK kodiranje baza',
  'home.bases.subtitle': 'Svaki ASCII karakter (8 bita) se mapira na 4 DNK baze, po 2 bita po bazi',

  // Home - CTA
  'home.cta2.title': 'Počni istraživanje skladištenja podataka u DNK',
  'home.cta2.desc':
    'Enkodiraj sopstveni tekst, unesi greške i vidi kako funkcionišu mehanizmi oporavka.',
  'home.cta2.button': 'Otvori simulator →',

  // About
  'about.badge': 'Diplomski rad',
  'about.title': 'O ovom projektu',
  'about.subtitle':
    'Implementacija simulatora skladištenja podataka u DNK sa simulacijom grešaka i mehanizmima oporavka',
  'about.overview.title': 'Pregled projekta',
  'about.overview.p1':
    'Ovaj simulator modeluje enkodiranje digitalnih podataka u sintetičku DNK, simulira realne greške koje se javljaju tokom sinteze i sekvenciranja, i primenjuje mehanizme korekcije za oporavak originalnih podataka.',
  'about.overview.p2':
    'Skladištenje u DNK teorijski može da smesti 215 petabajta po gramu, ali praktične implementacije trpe razne tipove grešaka koje narušavaju integritet podataka. Ovaj simulator pomaže da se vizualizuju i analiziraju ti oblici otkaza.',
  'about.errors.title': 'Simulirani tipovi grešaka',
  'about.errors.substitution.title': 'Zamena baze',
  'about.errors.substitution.desc':
    'Nukleotid je pogrešno pročitan ili sintetizovan, čime se jedna baza zamenjuje drugom (npr. A→T).',
  'about.errors.insertion.title': 'Insercija baze',
  'about.errors.insertion.desc':
    'U sekvencu se ubacuje dodatni nukleotid, što izaziva pomeraj (frameshift) svih narednih baza.',
  'about.errors.deletion.title': 'Gubitak baze',
  'about.errors.deletion.desc':
    'Nukleotid se gubi iz sekvence, što izaziva pomeraj koji narušava sve naredne baze.',
  'about.errors.burst.title': 'Grupne (burst) greške',
  'about.errors.burst.desc':
    'Više uzastopnih baza je oštećeno u klasteru, što modeluje greške sinteze u klasterima.',
  'about.errors.dropout.title': 'Gubitak sekvence',
  'about.errors.dropout.desc':
    'Ceo DNK lanac je izgubljen ili postaje nečitljiv, simulirajući gubitak oligonukleotida.',
  'about.encoding.title': 'Šema kodiranja',
  'about.encoding.p1':
    'Simulator koristi direktno mapiranje binarnog zapisa u baze (2 bita po bazi):',
  'about.encoding.p2':
    'Svaki ASCII karakter (8 bita) postaje 4 DNK baze. Jedan lanac = jedan karakter.',
  'about.tech.title': 'Tehnološki stek',
  'about.tech.angular': 'Angular 22',
  'about.tech.angularSub': 'Frontend Framework',
  'about.tech.node': 'Node.js / Express',
  'about.tech.nodeSub': 'Backend',
  'about.tech.mongo': 'MongoDB',
  'about.tech.mongoSub': 'Baza podataka (planirano)',
  'about.status.title': 'Status razvoja',
  'about.status.encoding': 'Enkodiranje / dekodiranje DNK',
  'about.status.errorSim': 'Simulacija grešaka',
  'about.status.recovery': 'Oporavak grešaka (osnovni)',
  'about.status.ui': 'Vizuelni interfejs',
  'about.status.backend': 'Backend API',
  'about.status.auth': 'Autentifikacija korisnika',
  'about.status.history': 'Istorija simulacija',
  'about.cta': 'Isprobaj simulator →',

  // Simulator page
  'simulator.title': 'Simulator skladištenja u DNK',
  'simulator.subtitle':
    'Enkodiraj tekst u DNK sekvence, simuliraj greške i primeni mehanizme oporavka',
  'simulator.apiErrorEncode':
    'Enkodiranje nije uspelo. Proveri da li je backend pokrenut na portu 3000.',
  'simulator.apiErrorSimulate': 'Simulacija grešaka nije uspela. Pokušaj ponovo.',
  'simulator.apiErrorRecover': 'Oporavak podataka nije uspeo. Pokušaj ponovo.',

  'simulator.step1.heading': 'Unesi tekst za enkodiranje',
  'simulator.step1.desc':
    'Tvoj tekst će biti konvertovan u binarni zapis (ASCII) i mapiran na DNK baze. Svaki karakter postaje niz od 4 baze (2 bita po bazi). Maksimalno 60 karaktera.',
  'simulator.step1.placeholder': 'Unesi nešto... npr. Zdravo DNK!',
  'simulator.step1.encodingTitle': 'Šema kodiranja (2 bita po bazi)',
  'simulator.step1.button': 'Enkodiraj u DNK →',

  'simulator.step2.heading': 'DNK sekvenca',
  'simulator.step2.back': '← Nazad',
  'simulator.step2.configureErrors': 'Podesi greške →',

  'simulator.step3.heading': 'Podešavanje simulacije grešaka',
  'simulator.step3.desc':
    'Izaberi tipove grešaka i podesi stopu greške. Klikni "Simuliraj greške" da uneseš greške u DNK sekvencu.',
  'simulator.step3.previewTitle': 'Originalna sekvenca (pregled)',
  'simulator.step3.back': '← Nazad',
  'simulator.step3.simulate': '⚡ Simuliraj greške',
  'simulator.step3.resultsHeading': 'Rezultati simulacije grešaka',
  'simulator.step3.resultsDesc': 'Istaknute baze su izmenjene u odnosu na originalnu sekvencu.',
  'simulator.step3.original': 'Original',
  'simulator.step3.afterErrors': 'Nakon grešaka',
  'simulator.step3.reconfigure': '← Ponovo podesi',
  'simulator.step3.runRecovery': '↻ Pokreni oporavak',

  'simulator.step4.heading': 'Rezultati oporavka',
  'simulator.step4.desc':
    'Poređenje jedno pored drugog: original, oštećena i oporavljena sekvenca.',
  'simulator.step4.original': 'Original',
  'simulator.step4.afterErrors': 'Nakon grešaka',
  'simulator.step4.recovered': 'Oporavljeno',
  'simulator.step4.back': '← Nazad na greške',
  'simulator.step4.newSimulation': 'Nova simulacija',

  // Error controls
  'errorControls.title': 'Podešavanje grešaka',
  'errorControls.rateLabel': 'Stopa greške',
  'errorControls.typesLabel': 'Tipovi grešaka',
  'errorControls.burstLabel': 'Dužina grupne greške',
  'errorControls.substitution.label': 'Supstitucija',
  'errorControls.substitution.desc': 'Zamena jedne baze drugom',
  'errorControls.insertion.label': 'Insercija',
  'errorControls.insertion.desc': 'Ubacivanje dodatne baze',
  'errorControls.deletion.label': 'Delecija',
  'errorControls.deletion.desc': 'Uklanjanje baze iz sekvence',
  'errorControls.burst.label': 'Grupna greška',
  'errorControls.burst.desc': 'Više uzastopnih grešaka',
  'errorControls.dropout.label': 'Gubitak sekvence',
  'errorControls.dropout.desc': 'Ceo lanac je izgubljen',

  // Recovery panel
  'recoveryPanel.resultsTitle': 'Rezultati oporavka',
  'recoveryPanel.originalText': 'Originalni tekst',
  'recoveryPanel.recoveredText': 'Oporavljeni tekst',
  'recoveryPanel.corrections': 'Primenjene korekcije',
  'recoveryPanel.rateTitle': 'Stopa oporavka',
  'recoveryPanel.rateLabel': '% karaktera ispravno oporavljeno',
  'recoveryPanel.metricsTitle': 'Metrike simulacije',
  'recoveryPanel.totalErrors': 'Ukupno grešaka',
  'recoveryPanel.affectedStrands': 'Zahvaćeni lanci',
  'recoveryPanel.errorRate': 'Stopa grešaka',
  'recoveryPanel.correctionsLabel': 'Korekcije',

  // Step progress
  'steps.input': 'Unos',
  'steps.encoded': 'Enkodirano',
  'steps.errors': 'Greške',
  'steps.recovered': 'Oporavljeno',

  // Error type labels (used dynamically)
  'errorTypes.substitution': 'Supstitucija',
  'errorTypes.insertion': 'Insercija',
  'errorTypes.deletion': 'Delecija',
  'errorTypes.burst': 'Grupna greška',
  'errorTypes.dropout': 'Gubitak sekvence',

  // DNA sequence viewer
  'viewer.empty': 'Nema sekvence za prikaz',

  // Nav auth
  'nav.login': 'Prijava',
  'nav.register': 'Registracija',
  'nav.logout': 'Odjava',
  'nav.history': 'Istorija',

  // Auth pages
  'auth.login.title': 'Prijavi se',
  'auth.login.subtitle': 'Prijavi se da bi sačuvao i pregledao svoje simulacije',
  'auth.login.email': 'Email',
  'auth.login.password': 'Lozinka',
  'auth.login.submit': 'Prijavi se',
  'auth.login.noAccount': 'Nemaš nalog?',
  'auth.login.registerLink': 'Registruj se',
  'auth.register.title': 'Napravi nalog',
  'auth.register.subtitle': 'Registruj se da bi sačuvao svoje simulacije i pristupio im kasnije',
  'auth.register.username': 'Korisničko ime',
  'auth.register.email': 'Email',
  'auth.register.password': 'Lozinka',
  'auth.register.submit': 'Registruj se',
  'auth.register.hasAccount': 'Već imaš nalog?',
  'auth.register.loginLink': 'Prijavi se',
  'auth.error.generic': 'Nešto je pošlo po zlu. Pokušaj ponovo.',

  // History page
  'history.title': 'Moje simulacije',
  'history.subtitle': 'Pregledaj i ponovo pokreni prethodno sačuvane simulacije',
  'history.empty': 'Još uvek nemaš sačuvanih simulacija.',
  'history.emptyCta': 'Pokreni simulator →',
  'history.load': 'Otvori',
  'history.delete': 'Obriši',
  'history.successRate': 'Stopa oporavka',
  'history.createdAt': 'Sačuvano',

  // Save simulation (in simulator)
  'save.button': 'Sačuvaj simulaciju',
  'save.loginRequired': 'Prijavi se da bi sačuvao simulacije',
  'save.modalTitle': 'Sačuvaj simulaciju',
  'save.namePlaceholder': 'Naziv simulacije...',
  'save.confirm': 'Sačuvaj',
  'save.cancel': 'Otkaži',
  'save.success': 'Simulacija je sačuvana',
};

const EN: Translations = {
  'nav.home': 'Home',
  'nav.simulator': 'Simulator',
  'nav.about': 'About',
  'nav.launch': 'Launch Simulator →',

  'home.badge': "Bachelor's Thesis · MEAN Stack",
  'home.title1': 'DNA Data Storage',
  'home.title2': 'Simulator',
  'home.desc':
    'Encode digital data into synthetic DNA sequences. Simulate real-world storage errors. Apply recovery mechanisms. Visualize every step of the process.',
  'home.cta.launch': 'Launch Simulator →',
  'home.cta.learnMore': 'Learn More',
  'home.stats.errorTypes': 'Error Types',
  'home.stats.dnaBases': 'DNA Bases',
  'home.stats.perBase': 'Per Base',

  'home.how.title': 'How It Works',
  'home.how.subtitle': 'A three-stage pipeline modeling the full DNA storage lifecycle',
  'home.how.encode.title': 'Encode',
  'home.how.encode.desc':
    'Text is converted to binary (ASCII) and each 2-bit pair maps to a DNA base. Each character becomes a 4-base strand.',
  'home.how.errors.title': 'Simulate Errors',
  'home.how.errors.desc':
    'Inject realistic DNA storage errors: substitutions, insertions, deletions, burst errors, and sequence dropouts.',
  'home.how.recover.title': 'Recover',
  'home.how.recover.desc':
    'Apply error detection and correction. Analyze recovery rates, compare original vs. recovered sequences, and review statistics.',
  'home.how.recover.rateLabel': 'Recovery Rate',

  'home.bases.title': 'DNA Base Encoding',
  'home.bases.subtitle': 'Each ASCII character (8 bits) maps to 4 DNA bases at 2 bits per base',

  'home.cta2.title': 'Start exploring DNA data storage',
  'home.cta2.desc': 'Encode your own text, inject errors, and see how recovery mechanisms work.',
  'home.cta2.button': 'Open Simulator →',

  'about.badge': "Bachelor's Thesis",
  'about.title': 'About This Project',
  'about.subtitle':
    'Implementation of a DNA Data Storage Simulator with Error Simulation and Recovery Mechanisms',
  'about.overview.title': 'Project Overview',
  'about.overview.p1':
    'This simulator models encoding digital data into synthetic DNA, simulating the real-world errors that occur during synthesis and sequencing, and applying correction mechanisms to recover the original data.',
  'about.overview.p2':
    'DNA-based storage can theoretically hold 215 petabytes per gram, but practical implementations suffer from various error types that degrade data integrity. This simulator helps visualize and analyze these failure modes.',
  'about.errors.title': 'Error Types Simulated',
  'about.errors.substitution.title': 'Base Replacement',
  'about.errors.substitution.desc':
    'A nucleotide is incorrectly read or synthesized, replacing one base with another (e.g., A→T).',
  'about.errors.insertion.title': 'Base Insertion',
  'about.errors.insertion.desc':
    'An extra nucleotide is introduced into the sequence, causing a frameshift in all subsequent bases.',
  'about.errors.deletion.title': 'Base Loss',
  'about.errors.deletion.desc':
    'A nucleotide is lost from the sequence, causing a frameshift that corrupts all downstream bases.',
  'about.errors.burst.title': 'Burst Errors',
  'about.errors.burst.desc':
    'Multiple consecutive bases are corrupted in a cluster, modeling synthesis cluster failures.',
  'about.errors.dropout.title': 'Sequence Dropout',
  'about.errors.dropout.desc':
    'An entire DNA strand is lost or becomes unreadable, simulating oligo dropout.',
  'about.encoding.title': 'Encoding Scheme',
  'about.encoding.p1': 'The simulator uses a direct binary-to-base mapping (2 bits per base):',
  'about.encoding.p2':
    'Each ASCII character (8 bits) becomes 4 DNA bases. One strand = one character.',
  'about.tech.title': 'Technology Stack',
  'about.tech.angular': 'Angular 22',
  'about.tech.angularSub': 'Frontend Framework',
  'about.tech.node': 'Node.js / Express',
  'about.tech.nodeSub': 'Backend',
  'about.tech.mongo': 'MongoDB',
  'about.tech.mongoSub': 'Database (planned)',
  'about.status.title': 'Development Status',
  'about.status.encoding': 'DNA Encoding / Decoding',
  'about.status.errorSim': 'Error Simulation',
  'about.status.recovery': 'Error Recovery (basic)',
  'about.status.ui': 'Visual Interface',
  'about.status.backend': 'Backend API',
  'about.status.auth': 'User Authentication',
  'about.status.history': 'Simulation History',
  'about.cta': 'Try the Simulator →',

  'simulator.title': 'DNA Storage Simulator',
  'simulator.subtitle':
    'Encode text into DNA sequences, simulate errors, and apply recovery mechanisms',
  'simulator.apiErrorEncode': 'Failed to encode. Make sure backend is running on port 3000.',
  'simulator.apiErrorSimulate': 'Failed to simulate errors. Please try again.',
  'simulator.apiErrorRecover': 'Failed to recover data. Please try again.',

  'simulator.step1.heading': 'Enter text to encode',
  'simulator.step1.desc':
    'Your text will be converted to binary (ASCII) and mapped to DNA bases. Each character becomes a strand of 4 bases (2 bits/base). Max 60 characters.',
  'simulator.step1.placeholder': 'Type something... e.g., Hello DNA!',
  'simulator.step1.encodingTitle': 'Encoding Scheme (2 bits per base)',
  'simulator.step1.button': 'Encode to DNA →',

  'simulator.step2.heading': 'DNA Sequence',
  'simulator.step2.back': '← Back',
  'simulator.step2.configureErrors': 'Configure Errors →',

  'simulator.step3.heading': 'Configure Error Simulation',
  'simulator.step3.desc':
    'Select error types and set the error rate. Click "Simulate Errors" to inject errors into the DNA sequence.',
  'simulator.step3.previewTitle': 'Original Sequence (Preview)',
  'simulator.step3.back': '← Back',
  'simulator.step3.simulate': '⚡ Simulate Errors',
  'simulator.step3.resultsHeading': 'Error Simulation Results',
  'simulator.step3.resultsDesc': 'Highlighted bases were modified from the original sequence.',
  'simulator.step3.original': 'Original',
  'simulator.step3.afterErrors': 'After Errors',
  'simulator.step3.reconfigure': '← Reconfigure',
  'simulator.step3.runRecovery': '↻ Run Recovery',

  'simulator.step4.heading': 'Recovery Results',
  'simulator.step4.desc':
    'Side-by-side comparison: original, error-corrupted, and recovered sequences.',
  'simulator.step4.original': 'Original',
  'simulator.step4.afterErrors': 'After Errors',
  'simulator.step4.recovered': 'Recovered',
  'simulator.step4.back': '← Back to Errors',
  'simulator.step4.newSimulation': 'New Simulation',

  'errorControls.title': 'Error Configuration',
  'errorControls.rateLabel': 'Error Rate',
  'errorControls.typesLabel': 'Error Types',
  'errorControls.burstLabel': 'Burst Length',
  'errorControls.substitution.label': 'Substitution',
  'errorControls.substitution.desc': 'Replace one base with another',
  'errorControls.insertion.label': 'Insertion',
  'errorControls.insertion.desc': 'Insert an extra base',
  'errorControls.deletion.label': 'Deletion',
  'errorControls.deletion.desc': 'Remove a base from sequence',
  'errorControls.burst.label': 'Burst',
  'errorControls.burst.desc': 'Multiple consecutive errors',
  'errorControls.dropout.label': 'Dropout',
  'errorControls.dropout.desc': 'Entire sequence lost',

  'recoveryPanel.resultsTitle': 'Recovery Results',
  'recoveryPanel.originalText': 'Original Text',
  'recoveryPanel.recoveredText': 'Recovered Text',
  'recoveryPanel.corrections': 'Corrections Applied',
  'recoveryPanel.rateTitle': 'Recovery Rate',
  'recoveryPanel.rateLabel': '% characters recovered correctly',
  'recoveryPanel.metricsTitle': 'Simulation Metrics',
  'recoveryPanel.totalErrors': 'Total Errors',
  'recoveryPanel.affectedStrands': 'Affected Strands',
  'recoveryPanel.errorRate': 'Error Rate',
  'recoveryPanel.correctionsLabel': 'Corrections',

  'steps.input': 'Input',
  'steps.encoded': 'Encoded',
  'steps.errors': 'Errors',
  'steps.recovered': 'Recovered',

  'errorTypes.substitution': 'Substitution',
  'errorTypes.insertion': 'Insertion',
  'errorTypes.deletion': 'Deletion',
  'errorTypes.burst': 'Burst',
  'errorTypes.dropout': 'Dropout',

  'viewer.empty': 'No sequence to display',

  // Nav auth
  'nav.login': 'Login',
  'nav.register': 'Register',
  'nav.logout': 'Logout',
  'nav.history': 'History',

  // Auth pages
  'auth.login.title': 'Log In',
  'auth.login.subtitle': 'Log in to save and review your simulations',
  'auth.login.email': 'Email',
  'auth.login.password': 'Password',
  'auth.login.submit': 'Log In',
  'auth.login.noAccount': "Don't have an account?",
  'auth.login.registerLink': 'Register',
  'auth.register.title': 'Create Account',
  'auth.register.subtitle': 'Register to save your simulations and access them later',
  'auth.register.username': 'Username',
  'auth.register.email': 'Email',
  'auth.register.password': 'Password',
  'auth.register.submit': 'Register',
  'auth.register.hasAccount': 'Already have an account?',
  'auth.register.loginLink': 'Log In',
  'auth.error.generic': 'Something went wrong. Please try again.',

  // History page
  'history.title': 'My Simulations',
  'history.subtitle': 'Review and re-run your previously saved simulations',
  'history.empty': "You don't have any saved simulations yet.",
  'history.emptyCta': 'Open Simulator →',
  'history.load': 'Open',
  'history.delete': 'Delete',
  'history.successRate': 'Recovery Rate',
  'history.createdAt': 'Saved',

  // Save simulation (in simulator)
  'save.button': 'Save Simulation',
  'save.loginRequired': 'Log in to save simulations',
  'save.modalTitle': 'Save Simulation',
  'save.namePlaceholder': 'Simulation name...',
  'save.confirm': 'Save',
  'save.cancel': 'Cancel',
  'save.success': 'Simulation saved',
};

const DICTIONARIES: Record<Lang, Translations> = { sr: SR, en: EN };

function readInitialLang(): Lang {
  if (typeof localStorage === 'undefined') return 'sr';
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'en' || stored === 'sr' ? stored : 'sr';
}

@Service()
export class I18nService {
  readonly currentLang = signal<Lang>(readInitialLang());

  setLang(lang: Lang): void {
    this.currentLang.set(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }

  toggleLang(): void {
    this.setLang(this.currentLang() === 'sr' ? 'en' : 'sr');
  }

  t(key: string, params?: Record<string, string | number>): string {
    const dict = DICTIONARIES[this.currentLang()];
    let value = dict[key] ?? key;

    if (params) {
      for (const [param, replacement] of Object.entries(params)) {
        value = value.replace(`{{${param}}}`, String(replacement));
      }
    }

    return value;
  }
}
