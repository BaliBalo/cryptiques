<script setup lang="ts">
	useHead({
		title: 'Guide | Cryptiques',
		// bodyAttrs: { class: 'page-guide' },
	});

	const introSlideshow = useTemplateRef('introSlideshow');
	const router = useRouter();

	onMounted(() => {
		const prefersReducesMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

		const allTimelines: string[] = [];
		const tocLinks = document.querySelectorAll<HTMLLinkElement>('#toc a[href^="#"]');
		tocLinks.forEach(link => {
			const id = link.getAttribute('href')?.slice(1) || '';
			if (!id) return;
			const timeline = `--toc-${id}`;
			link.style.setProperty('animation-timeline', timeline);
			document.getElementById(id)?.style.setProperty('view-timeline', `${timeline} y`);
			allTimelines.push(timeline);
		});
		document.documentElement.style.setProperty('timeline-scope', allTimelines.join(','));

		document.addEventListener('click', async e => {
			const hashLink = e.target instanceof Element && e.target.closest('a[href^="#"]');
			if (!(hashLink instanceof HTMLAnchorElement)) return;

			const id = hashLink.getAttribute('href')?.slice(1) || '';
			const destination = document.getElementById(id);
			if (!destination) return;

			e.preventDefault();
			e.stopPropagation();

			const bounds = destination.getBoundingClientRect();
			const halfViewportHeight = window.innerHeight / 2;
			// try to get the element centered but never scroll past the top of the element
			const top = document.documentElement.scrollTop + bounds.top - Math.max(halfViewportHeight - bounds.height / 2, 0);
			window.scrollTo({ top, behavior: prefersReducesMotion.matches ? 'instant' : 'smooth' });

			// const url = hashLink.pathname + hashLink.search + hashLink.hash;
			// await router.push(url)
			history.pushState(history.state, '', hashLink.href);
		}, true);

		if (!CSS.supports('animation-timeline: --works')) {
			function setIntroScrollProgress() {
				const el = introSlideshow.value;
				if (!el) return;
				el.style.setProperty('--intro-scroll-progress', `${el.scrollLeft / el.clientWidth}`);
			}
			introSlideshow.value?.addEventListener('scroll', setIntroScrollProgress);
			setIntroScrollProgress();

			function setTOCScrollProgress() {
				const wh = window.innerHeight;
				tocLinks.forEach(link => {
					const id = link.getAttribute('href')!.slice(1);
					const target = document.getElementById(id);
					if (!target) return;
					const rect = target.getBoundingClientRect();
					const visibleHeight = Math.min(rect.height, wh);
					const entry = Math.min(1, Math.max(0, (wh - rect.top) / visibleHeight));
					const exit = Math.min(1, Math.max(0, (visibleHeight - rect.bottom) / visibleHeight));
					link.style.setProperty('--entry', `${entry}`);
					link.style.setProperty('--exit', `${exit}`);
					const active = rect.top < wh / 2 && rect.bottom > wh / 2;
					link.style.setProperty('--active', `${active ? 1 : 0}`);
				});
			}
			setTOCScrollProgress();
			document.addEventListener('scroll', setTOCScrollProgress);
		}
	});
</script>

<template>
	<header>
		<NuxtLink to="/" class="back" aria-label="Retour à l'accueil">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" height="24px"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
		</NuxtLink>
		<button popovertarget="toc" class="toc-toggle" aria-label="Afficher le sommaire">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" height="24px"><path d="M120-280v-80h560v80H120Zm0-160v-80h560v80H120Zm0-160v-80h560v80H120Zm680 320q-17 0-28.5-11.5T760-320q0-17 11.5-28.5T800-360q17 0 28.5 11.5T840-320q0 17-11.5 28.5T800-280Zm0-160q-17 0-28.5-11.5T760-480q0-17 11.5-28.5T800-520q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440Zm0-160q-17 0-28.5-11.5T760-640q0-17 11.5-28.5T800-680q17 0 28.5 11.5T840-640q0 17-11.5 28.5T800-600Z"/></svg>
		</button>
		<nav id="toc" popover>
			<button popovertarget="toc" popovertargetaction="hide" class="close" aria-label="Fermer le sommaire"></button>
			<ol>
				<li><NuxtLink to="#quoi">Qu'est-ce que c'est?</NuxtLink></li>
				<li><NuxtLink to="#principes">Principes de base</NuxtLink></li>
				<li>
					<NuxtLink to="#techniques">Techniques courantes</NuxtLink>
					<ol>
						<li><NuxtLink to="#positionnement">Positionnement</NuxtLink></li>
						<li><NuxtLink to="#substitution">Substitution</NuxtLink></li>
						<li>
							<NuxtLink to="#anagrammes">Anagrammes</NuxtLink>
							<ol>
								<li><NuxtLink to="#anagrammes-spéciaux">Anagrammes spéciaux</NuxtLink></li>
							</ol>
						</li>
						<li><NuxtLink to="#sélection">Sélection</NuxtLink></li>
						<li><NuxtLink to="#insertion">Insertion</NuxtLink></li>
						<li><NuxtLink to="#suppression">Suppression</NuxtLink></li>
						<li><NuxtLink to="#cachés">Cachés</NuxtLink></li>
						<li><NuxtLink to="#homophones">Homophones</NuxtLink></li>
					</ol>
				</li>
				<li>
					<NuxtLink to="#exceptions">Exceptions</NuxtLink>
					<ol>
						<li><NuxtLink to="#double-définitions">Double définitions</NuxtLink></li>
						<li><NuxtLink to="#définition-cryptique">Définition cryptique</NuxtLink></li>
						<li><NuxtLink to="#tout-en-un">Tout-en-un</NuxtLink></li>
						<li><NuxtLink to="#rébus">Rébus</NuxtLink></li>
					</ol>
				</li>
				<li>
					<NuxtLink to="#divers">Autres détails</NuxtLink>
					<ol>
						<li><NuxtLink to="#mots-de-liaison">Mots de liaison</NuxtLink></li>
						<li><NuxtLink to="#ponctuation">Ponctuation</NuxtLink></li>
						<li><NuxtLink to="#accents">Accents</NuxtLink></li>
						<li><NuxtLink to="#mots-à-double-usage">Mots à double usage</NuxtLink></li>
						<li><NuxtLink to="#mots-superflus">Mots superflus</NuxtLink></li>
					</ol>
				</li>
				<li><NuxtLink to="#outils">Liens utiles</NuxtLink></li>
			</ol>
		</nav>
	</header>
	<main class="main">
		<section class="section">
			<h1 class="page-title">Guide<br><small>aux cryptiques</small></h1>
		</section>

		<section class="section" id="quoi">
			<h2>Qu'est-ce que c'est?</h2>
			<p>Les cryptiques, plus souvent connus sous la forme de mots croisés, sont une forme de casse-tête originaire du Royaume-Uni.</p>
			<p>Voyons tout d'abord quelques principes de base via un exemple.</p>
			<Aside type="warning">
				<template #title>Une note sur les termes utilisés</template>
				<p>Les cryptiques n'étant pas encore très populaires dans le monde francophone, beaucoup des termes dans ce guide sont inspirés de leurs équivalents anglais, ou tout simplement inventés pour ce guide. Il se peut qu'ils changent à l'avenir. Si vous avez des suggestions d'améliorations, n'hésitez pas à les partager via <a href="https://github.com/BaliBalo/cryptiques/issues" target="_blank" rel="noopener noreferrer">un ticket sur GitHub</a>.</p>
			</Aside>
		</section>

		<section class="section" id="principes">
			<div class="intro-slideshow" ref="introSlideshow">
				<div class="static">
					<div class="clue">
						<span class="clue-highlight surface"><span class="clue-highlight wordplay"><span class="clue-highlight indicator-1">Fin de</span> <span class="clue-highlight fodder-1">troubl<span class="clue-highlight fodder-1-sel">e</span></span> <span class="clue-highlight indicator-3">après</span> <span class="clue-highlight fodder-2">mai</span> <span class="clue-highlight indicator-2">turbulent</span></span> <span class="clue-highlight linking">pour</span> <span class="clue-highlight definition">une proche</span></span> <span class="clue-highlight length">(4)</span>
					</div>
					<div class="answer">
						<span class="letter a">a</span>
						<span class="letter m">m</span>
						<span class="letter i">i</span>
						<span class="letter e">e</span>
					</div>
				</div>
				<div class="slides">
					<div class="slide">
						<p>Voilà une énigme cryptique classique.</p>
						<p>La grande majorité des énigmes auront cette forme.</p>
					</div>
					<div class="slide">
						<p>Les chiffres entre parenthèses à la fin indiquent la longueur de la réponse, ici 4 lettres.</p>
						<p>Les espaces et traits d'union sont également indiqués. Par exemple, "au revoir" serait (2, 6) et "pique-nique" serait (6-5).</p>
					</div>
					<div class="slide">
						<p>
							L'ensemble du texte forme la <span class="highlight surface">surface</span> (court pour "lecture de surface"): c'est le sens apparent de la phrase.
						</p>
						<p>La surface ressemble donc à une phrase plus ou moins normale. Mais attention, ce qu'elle semble dire a souvent peu de rapport avec la réponse !</p>
					</div>
					<div class="slide">
						<p>Chaque énigme contient une <span class="highlight definition">définition</span>, que l'on pourrait trouver dans une grille de mots croisés traditionnelle.</p>
						<p>Cette définition est toujours au début ou à la fin de l'énigme.</p>
					</div>
					<div class="slide">
						<p>Chaque énigme contient aussi une <span class="highlight wordplay">recette</span>. Elle contient une série d'instructions donnant la même solution que la définition.</p>
						<p>La recette peut par exemple inclure des manipulations de lettres, des synonymes, des homophones, etc.</p>
						<p>Chacune de ces opérations y est explicitement décrite si on lit les choses de la bonne façon.</p>
					</div>
					<div class="slide">
						<p>La définition et la recette peuvent parfois être reliées par un <span class="highlight linking">mot de liaison</span>.</p>
						<p>Ce mot de liaison est en quelque sorte le "=" qui relie les deux parties de l'énigme.</p>
						<p>C'est souvent l'un des seuls mots qui peuvent être ignorés.</p>
					</div>
					<div class="slide">
						<p>Voici la recette de cette énigme:</p>
						<p><span class="highlight underline color-1">fin de</span> est un <em>indicateur</em>: c'est une instruction qui nous dit de prendre la dernière lettre d'un mot voisin.</p>
						<p><span class="highlight fodder color-1">trouble</span> est la <em>matière</em> utilisée par l'indicateur.</p>
						<p>"fin de trouble" nous donne donc la lettre E.</p>
					</div>
					<div class="slide">
						<p><span class="highlight underline color-2">turbulent</span> est un autre <em>indicateur</em>, qui nous dit cette fois de mélanger des lettres voisines.</p>
						<p><span class="highlight fodder color-2">mai</span> est la <em>matière</em> utilisée ici.</p>
						<p>"mai turbulent" nous dit donc d'utiliser une anagramme de "mai" dans la réponse.</p>
					</div>
					<div class="slide">
						<p><span class="highlight underline color-3">après</span> est un indicateur de position: il nous dit simplement que le E vient après l'anagramme.</p>
						<p>En suivant ces instructions, on peut arriver au mot <code>amie</code>, correspondant à la définition <span class="highlight definition">une proche</span>.</p>
						<p>C'est donc notre solution !</p>
					</div>
				</div>
				<div class="static navigation">
					<div class="page"></div>
				</div>
			</div>
		</section>

		<section class="section" id="techniques">
			<h2>Techniques courantes</h2>
			<p>La <span class="highlight underline wordplay">recette</span> (parfois appelée la partie "jeu de mots") d'une énigme contient une ou plusieurs <em>techniques</em>.</p>
			<p>Une <em>technique</em> comprend en général un <span class="highlight underline color-2">indicateur</span> (l'action à effectuer) et de la <span class="highlight underline color-1">matière</span> (les mots dont on considère les lettres pour effectuer l'action).</p>
			<p>Un <span class="highlight underline color-2">indicateur</span> ne peut pas être sa propre <span class="highlight underline color-1">matière</span>.</p>
			<p>Dans les chapitres qui suivent, nous allons passer en revue les techniques couramment utilisées.</p>
		</section>

		<section class="section" id="positionnement">
			<h3>Positionnement</h3>
			<p>Les résultats de plusieurs techniques sont souvent mis bout à bout.</p>
			<p>Si les parties à enchaîner sont dans le bon ordre, il n'y aura pas nécessairement d'indicateur ; mais il peut y en avoir un quand même (surtout si ça aide la <span class="highlight underline surface">surface</span>). Par exemple, <code>A <span class="highlight underline color-2">avec</span> B</code> pour <code>AB</code>.</p>
			<p>Si elles sont à mettre dans l'ordre inverse, cela sera indiqué. Par exemple, <code>A <span class="highlight underline color-2">à la suite de</span> B</code> pour <code>BA</code>.</p>
			<Aside type="info">
				<template #title>Pas nécessairement remplacés</template>
				<p>Certains mots peuvent être utilisés tels quels dans la réponse, sans aucune opération pour les transformer.</p>
			</Aside>
			<p>Un exemple complet:</p>
			<Clue example answer="robinet" :hints="{
				indicators: { ranges: [[3, 8]], note: 'C\'est un indicateur de positionnement.' },
				fodder: { ranges: [[0, 2], [9, 14]], note: 'On utilisera ces mots tels quels.' },
				definition: { range: [15, 29], note: 'On cherche donc quelque chose qui peut contrôler l\'eau.' },
				answer: 'ROBIN + ET, tout simplement.',
			}">
				Et après Robin contrôle l'eau
			</Clue>
		</section>

		<section class="section" id="substitution">
			<h3>Substitution</h3>
			<p>Les substitutions sont la seule technique (à part les techniques de positionnement dans certains cas) ne nécessitant pas d'<span class="highlight underline color-2">indicateur</span>. Elles consistent à remplacer un mot par un synonyme.</p>
			<Aside type="warning">
				<template #title>Une technique difficile</template>
				<p>Puisque n'importe quel mot peut être remplacé sans indication, et qu'il y a souvent beaucoup de synonymes possibles, arriver à repérer les substitutions peut être difficile. Ne vous inquiétez pas si elles vous échappent au début.</p>
			</Aside>
			<p>À quelques exceptions près, les synonymes utilisés seront attestés par un dictionnaire.</p>
			<p>Voici une liste de quelques catégories d'abréviations couramment utilisées, puisqu'elles permettent de représenter certains mots ou concepts de manière concise:</p>
			<ul class="expandable">
				<li>
					<details>
						<summary>Numérotation romaine</summary>
						<p>I, II, III, IV, V, ...</p>
						<p>Par exemple, <code>51</code> peut être remplacé par <code>LI</code>.</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Alphabet phonétique</summary>
						<p>Alpha, Bravo, Charlie, ...</p>
						<p>Par exemple, <code>bravo</code> peut être remplacé par <code>B</code>.</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Unités de mesure</summary>
						<p>s, L, m, g, ...</p>
						<p>Par exemple, <code>litre</code> peut être remplacé par <code>L</code>.</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Symboles chimiques</summary>
						<p>H, C, O, N, ...</p>
						<p>Par exemple, <code>hydrogène</code> peut être remplacé par <code>H</code>.</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Codes de pays</summary>
						<p>FR, US, DE, IT, ...</p>
						<p>Par exemple, <code>France</code> peut être remplacé par <code>FR</code>.</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Tailles de vêtements</summary>
						<p>XS, S, M, L, XL</p>
						<p>Par exemple, <code>petit</code> peut être remplacé par <code>S</code>.</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Pièces d'échecs</summary>
						<p>R, D, T, F, C, P</p>
						<p>Par exemple, <code>tour</code> peut être remplacé par <code>T</code>.</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Symboles musicaux</summary>
						<p>Par exemple, <code>sol</code> peut être remplacé par <code>G</code> (notes anglaises).</p>
						<p><code>p</code> et <code>f</code> peuvent aussi être des remplacements pour <code>doux</code> et <code>fort</code> respectivement (de "piano" et "forte")</p>
					</details>
				</li>
			</ul>
			<p>Un exemple:</p>
			<Clue example answer="vipères" :hints="{
				fodder: { ranges: [[0, 3], [4, 9]], note: 'On utilisera des synonymes de ces mots.' },
				definition: { range: [10, 18] },
				answer: 'Six est remplacé par VI (son écriture en nombres romains), et papas par pères.',
			}">
				Six papas serpents
			</Clue>
		</section>
		<section class="section" id="anagrammes">
			<h3>Anagrammes</h3>
			<p>Les anagrammes consistent à réarranger les lettres de la <span class="highlight underline color-1">matière</span>.</p>
			<Aside type="info">
				<template #title>Juste une collection de lettres</template>
				<p>Le résultat d'une anagramme n'a pas forcément besoin d'être directement un mot valide en lui-même, il peut être utilisé avec d'autres techniques pour former la réponse.</p>
			</Aside>
			<p>Beaucoup de termes peuvent servir d'<span class="highlight underline color-2">indicateur</span> pour les anagrammes, les reconnaître est important. En gros, tous les mots se rapprochant d'un de ces thèmes peuvent être utilisés:</p>
			<ul class="expandable">
				<li>
					<details>
						<summary>Changement</summary>
						<p>Modifié, organisé, transformé, mis à neuf, ...</p>
						<p>Anagrammer un mot, c'est le changer.</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Mouvement</summary>
						<p>Agité, frénétique, dansant, ...</p>
						<p>On peut imaginer les lettres du mot (et par extension, le mot lui-même) en mouvement, bougeant d'une place à l'autre.</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Destruction</summary>
						<p>En miettes, cassé, anéanti, éparpillé, ...</p>
						<p>Si un mot est détruit, on peut imaginer ses lettres dispersées et donc dans un ordre différent.</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Fausseté</summary>
						<p>Incorrect, faux, trompeur, ...</p>
						<p>Si un mot est faux, on peut imaginer que sa vraie version est un autre arrangement de ses lettres.</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Préparation</summary>
						<p>Préparé, cuisiné, ...</p>
						<p>On peut imaginer les lettres du mot comme des éléments à assembler, ou des ingrédients à mélanger.</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Folie</summary>
						<p>Fou, dingue, délirant, ...</p>
						<p>La folie est souvent associée au chaos ou au désordre.</p>
					</details>
				</li>
			</ul>
			<p>Un exemple:</p>
			<Clue example answer="littoral" :hints="{
				indicators: { ranges: [[9, 17]], note: 'C\'est un indicateur d\'anagramme.' },
				fodder: { ranges: [[0, 8]] },
				definition: { range: [18, 32] },
			}">
				Tortilla cuisinée au bord de mer
			</Clue>
		</section>
		<section class="section" id="anagrammes-spéciaux">
			<h4>Anagrammes spéciaux</h4>
			<p>Certains <span class="highlight underline color-2">indicateurs</span> donnent des informations plus précises sur la façon de réarranger les lettres.</p>
			<p>Ils peuvent nous dire d'inverser le mot, de le trier par ordre alphabétique, d'échanger des lettres spécifiques...</p>
			<p>Un exemple:</p>
			<Clue example answer="réunis" :hints="{
				indicators: { ranges: [[7, 25]], note: 'C\'est un indicateur de renversement (un type d\'anagramme où les lettres sont exactement dans l\'ordre inverse).' },
				fodder: { ranges: [[0, 6]] },
				definition: { range: [26, 34] },
				answer: 'C\'est SINUER écrit à l\'envers.',
			}">
				Sinuer de droite à gauche ensemble
			</Clue>
		</section>
		<section class="section" id="sélection">
			<h3>Sélection</h3>
			<p>Les techniques de séléction consistent à n'utiliser (ou supprimer) que certaines lettres de la <span class="highlight underline color-1">matière</span>.</p>
			<p>Il y en a plusieurs types. Voici les plus communs:</p>
			<ul class="expandable">
				<li>
					<details>
						<summary>Début</summary>
						<p>Ne prendre en compte que la ou les premières lettres de mots alentour.</p>
						<p>Indicateurs: début, première, initiale, ...</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Fin</summary>
						<p>Ne prendre en compte que la ou les dernières lettres de mots alentour.</p>
						<p>Indicateurs: fin, dernière, finale, bout, ...</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Centre</summary>
						<p>Ne prendre en compte que la ou les lettres centrales de mots alentour.</p>
						<p>Indicateurs: milieu, centre, coeur, ...</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Extérieur</summary>
						<p>Ne prendre en compte que les lettres externes (première et dernière) de mots alentours.</p>
						<p>Indicateurs: enrobant, vêtements, contour, murs, ...</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Intérieur</summary>
						<p>Ne prendre en compte que les lettres internes (celles qui ne sont pas aux extrémités) de mots alentours.</p>
						<p>Indicateurs: tronc, nu, démembré, ...</p>
					</details>
				</li>
				<li>
					<details>
						<summary>Alterné</summary>
						<p>Ne prendre en compte que les lettres alternées de mots alentours.</p>
						<p>Indicateurs: paire, impaire, alternatif, régulièrement, tous les deux, ...</p>
					</details>
				</li>
			</ul>
			<Aside type="info">
				<template #title>Gardez un œil sur les accords</template>
				<p>Chacun de ces indicateurs peut s'appliquer à un ou plusieurs mots.</p>
				<p>Le fait que l'indicateur soit singulier ou pluriel est en général un bon indice pour le déduire.</p>
			</Aside>
			<p>Un exemple:</p>
			<Clue example answer="pacte" :hints="{
				indicators: { ranges: [[0, 8]], note: 'C\'est un indicateur de séléction qui nous dit de prendre les premières lettres de la matière associée.' },
				fodder: { ranges: [[9, 38]], note: 'On n\'utilisera que certaines lettres telles que spécifiées par l\'indicateur.' },
				definition: { range: [51, 61] },
				answer: 'Ce sont les premières lettres des mots de &quot;Pas Au Cinéma Très Expressifs&quot;.',
			}">
				Premiers pas au cinéma très expressifs fournissent un contrat
			</Clue>
		</section>
		<section class="section" id="insertion">
			<h3>Insertion</h3>
			<p>Les techniques d'insertion consistent à ajouter de la <span class="highlight underline color-1">matière</span> dans un autre bout de <span class="highlight underline color-1">matière</span>.</p>
			<p>Quelques <span class="highlight underline color-2">indicateurs</span> possibles: dans, ajouter, introduire, autour de, ...</p>
			<p>Les lettres à insérer peuvent être spécifiées via un indicateur de sélection, ou un mot complet (en général via une substitution).</p>
			<p>Un exemple:</p>
			<Clue example answer="coquille" :hints="{
				indicators: { ranges: [[9, 17]], note: 'C\'est un indicateur d\'insertion, on mettra donc un des mots dans l\'autre.' },
				fodder: { ranges: [[5, 8], [19, 24]] },
				definition: { range: [0, 4] },
				answer: '&quot;qui&quot; est ajouté au milieu du mot &quot;colle&quot; pour donner CO(qui)LLE ; une coquille est une faute typographique, aussi appelée typo.',
			}">
				Typo qui est dans "colle"
			</Clue>
		</section>
		<section class="section" id="suppression">
			<h3>Suppression</h3>
			<p>Très similaires aux insertions, les techniques de suppression consistent à retirer certaines lettres de la <span class="highlight underline color-1">matière</span>.</p>
			<p>Quelques <span class="highlight underline color-2">indicateurs</span> possibles: sans, privé de, dépourvu de, abandonne, ...</p>
			<p>Un exemple:</p>
			<Clue example answer="open" :hints="{
				indicators: { ranges: [[10, 14]], note: 'C\'est un indicateur de suppression.' },
				fodder: { ranges: [[0, 9], [15, 22]], note: 'On prendra une substitution d\'un de ces mots pour l\'utiliser comme indiqué par l\'indicateur.' },
				definition: { range: [28, 49] },
				answer: 'En mathématiques, le rapport entre deux nombres est leur ratio. Si on retire &quot;ratio&quot; d\'OPERATION, on obtient OPEN, le nom de certains tournois de tennis.',
			}">
				Opération sans rapport avec compétition de tennis
			</Clue>
		</section>
		<section class="section" id="cachés">
			<h3>Cachés</h3>
			<p>Les techniques de mots cachés consistent à trouver la solution écrite telle-quelle dans la <span class="highlight underline color-1">matière</span> (en ignorant les espaces et la ponctuation).</p>
			<Aside type="info">
				<template #title>Attention aux espaces</template>
				<p>Les cachés peuvent parfois être au milieu d'un seul mot, mais ils sont souvent dispersés sur plusieurs mots pour être plus difficiles à repérer.</p>
			</Aside>
			<p>Quelques <span class="highlight underline color-2">indicateurs</span> possibles: dans, couvre, cache, capturé, morceau, avalé, ...</p>
			<p>Un exemple:</p>
			<Clue example answer="correct" :hints="{
				indicators: { ranges: [[6, 16]], note: 'On cherche donc la réponse cachée dans la matière, dans le bon ordre.' },
				fodder: { ranges: [[17, 36]] },
				definition: { range: [0, 5] },
				answer: 'On peut voir la réponse cachée plus facilement si on retire l\'espace: déCORRECTangulaire.',
			}">
				Juste caché dans décor rectangulaire
			</Clue>
		</section>
		<section class="section" id="homophones">
			<h3>Homophones</h3>
			<p>Les techniques d'homophones consistent à remplacer un mot par un autre qui se prononce de la même façon.</p>
			<Aside type="info">
				<template #title>Souvent remplacé</template>
				<p>Le mot servant d'homophone est presque toujours une substitution, puisque la réponse serait souvent trop évidente sinon.</p>
			</Aside>
			<p>Les <span class="highlight underline color-2">indicateurs</span> seront en général ce qui se rapproche de la parole: au téléphone, à voix haute, entendu, dit, ...</p>
			<p>Un exemple:</p>
			<Clue example answer="vert" :hints="{
				indicators: { ranges: [[35, 47]], note: 'C\'est un indicateur d\'homophone. On cherche donc un mot qui se prononce de la même façon qu\'un autre mot.' },
				fodder: { ranges: [[17, 34]], note: 'On utilisera un synonyme court.' },
				definition: { range: [0, 8] },
				answer: 'Un vers est un bout de poésie. C\'est aussi un homophone de vert, et un vert peut être un écolo.',
			}">
				Un écolo compose un bout de poésie à voix haute
			</Clue>
		</section>
		<section class="section" id="exceptions">
			<h2>Exceptions</h2>
			<p>Il y a quelques rares exceptions au format classique <span class="highlight underline definition">définition</span> / <span class="highlight underline wordplay">recette</span>, telles que les suivantes:</p>
		</section>
		<section class="section" id="double-définitions">
			<h3>Double définitions</h3>
			<p>Les énigmes à double définition présentent une seconde <span class="highlight underline definition">définition</span> au lieu d'une recette.</p>
			<p>La réponse doit souvent être interprétée de deux façons différentes pour correspondre aux deux définitions.</p>
			<p>Un exemple:</p>
			<Clue example answer="bien" :hints="{
				definition: { range: [0, 9] },
				altDefinition: { range: [10, 24] },
				answer: 'Une propriété est un bien ; bien veut aussi dire en bonne forme dans la phrase &quot;je suis bien&quot;.',
			}">
				Propriété en bonne forme
			</Clue>
		</section>
		<section class="section" id="définition-cryptique">
			<h3>Définition cryptique</h3>
			<p>Les définitions cryptiques sont des énigmes sans <span class="highlight underline wordplay">recette</span>, mais dont la <span class="highlight underline definition">définition</span> est formulée d'une manière assez inattendue.</p>
			<Aside type="info">
				<template #title>Plus souvent dans une grille</template>
				<p>Cette technique se prête mieux aux grilles de mots croisés, où les lettres de croisements peuvent aider à identifier la réponse. En tant qu'énigme indépendante, il est rare que ces énigmes soient assez claires pour être considérées justes.</p>
			</Aside>
			<p>Un exemple:</p>
			<Clue example answer="nonagénaire" :hints="{
				// definition: { range: [0, 23], note: 'Bah oui, on est dans le chapitre des définitions cryptiques.' },
				extra: [
					{ name: 'interprétation', range: [17, 21], content: 'Neuf doit être interprété comme le chiffre 9.' },
				],
				answer: 'Un nonagénaire est une personne âgée avec au moins un 9 dans l\'âge. (auteur: Robert Scipion)',
			}">
				Du vieux avec du neuf ?
			</Clue>
		</section>
		<section class="section" id="tout-en-un">
			<h3>Tout-en-un</h3>
			<p>Les énigmes "tout-en-un" (aussi appelées <code>&lit</code>, de l'anglais "and literally so") sont des énigmes dans lesquelles la <span class="highlight underline definition">définition</span> et la <span class="highlight underline wordplay">recette</span> sont combinés en une seule phrase.</p>
			<p>C'est à dire que la <span class="highlight underline definition">définition</span> est l'énigme entière, et la <span class="highlight underline wordplay">recette</span> aussi.</p>
			<Aside type="info">
				<template #title>Une technique rare</template>
				<p>Les énigmes tout-en-un sont difficiles à créer ! Elles sont donc beaucoup moins fréquentes.</p>
			</Aside>
			<p>Il y a aussi des "semi-&lit", dans lesquelles l'énigme entière est la <span class="highlight underline definition">définition</span>, mais seulement une partie est la <span class="highlight underline wordplay">recette</span>.</p>
			<p>Un exemple:</p>
			<Clue example answer="jésus" :hints="{
				indicators: { ranges: [[8, 15]], note: 'Si quelque chose est mort, alors cette chose n\'est plus. Cela peut donc être un indicateur de supression.' },
				fodder: { ranges: [[0, 7], [15, 24]], note: 'Une partie sera remplacée par un synonyme court.' },
				definition: { range: [0, 26], note: 'C\'est une énigme tout-en-un, donc l\'énigme entière est la définition, mais aussi la recette.' },
				answer: '&quot;Un romain&quot; peut décrire la lettre i (1, en chiffres romains). Si on prend le texte &quot;JE SUIS&quot; et que l\'on retire le i (et l\'espace), on obtient JESUS, quelqu\'un fameusement tué par les Romains.',
			}">
				Je suis mort d'un Romain !
			</Clue>
		</section>
		<section class="section" id="rébus">
			<h3>Rébus</h3>
			<p>Dans une énigme rébus, la réponse décrit ce qui se passe dans l'énigme.</p>
			<Aside type="info">
				<template #title>Astuce pour les repérer</template>
				<p>Si vous voyez des choses bizarres dans l'énigme, par exemple une capitalisation étrange ou des symboles inhabituels, il s'agit probablement d'un rébus.</p>
			</Aside>
			<p>Un exemple:</p>
			<Clue example answer="coup" :hints="{
				definition: { range: [0, 6] },
				extra: [
					{ name: 'rébus', range: [20, 25], content: 'Il y a deux lettres qui peuvent compléter le mot _alme. La réponse décrira ces deux possibilités.' },
				],
				answer: 'La lettre manquante pourrait être C ou P. Donc, sans les espaces, &quot;CouP&quot;, et un coup peut être une astuce.',
			}">
				Astuce pour trouver _alme
			</Clue>
		</section>
		<section class="section" id="divers">
			<h2>Autres détails</h2>
			<p>Nous avons passé en revue toutes les techniques principales utilisées dans les cryptiques.</p>
			<Aside type="success">
				<template #title>Vous êtes prêt !</template>
				<p>Vous avez maintenant les outils nécessaires pour aborder les énigmes cryptiques.</p>
				<p>Ce que ce guide ne pourra pas vous fournir, mais dont vous aurez besoin, est l'expérience !</p>
				<p>Alors, lancez-vous et amusez-vous à résoudre des cryptiques !</p>
			</Aside>
			<p>Il reste quand même quelques notes diverses à aborder, pouvant potentiellement vous aider.</p>
		</section>
		<section class="section" id="mots-de-liaison">
			<h3>Mots de liaison</h3>
			<p>Les mots de liaison, comme indiqué plus haut, lient la <span class="highlight underline definition">définition</span> et la <span class="highlight underline wordplay">recette</span> (ou les deux définitions).</p>
			<p>Ils indiquent soit que les deux sont égaux, soit qu'ils décrivent l'un comme l'autre la réponse, soit encore que l'un mène à l'autre.</p>
			<p>Voici une liste non-exhaustive de mots de liaison, et leur justification possible:</p>
			<ul class="expandable">
				<li>
					<details>
						<summary>est, égal, vaut</summary>
						<p><code>A = B</code></p>
						<p>Indique que les deux parties de l'énigme produisent des résultats égaux.</p>
					</details>
				</li>
				<li>
					<details>
						<summary>donne, produit, fait, créé, pour, rend, dans</summary>
						<p><code>A → B</code></p>
						<p>Indique que la première partie de l'énigme mène à la seconde.</p>
					</details>
				</li>
				<li>
					<details>
						<summary>par, de, avec</summary>
						<p><code>A ← B</code></p>
						<p>Indique que la seconde partie de l'énigme mène à la première.</p>
					</details>
				</li>
				<li>
					<details>
						<summary>ou, et, comme, ainsi que</summary>
						<p><code>A ; B</code></p>
						<p>Indique que la réponse finale peut être définie par la première partie mais aussi par la seconde.</p>
					</details>
				</li>
			</ul>
		</section>
		<section class="section" id="ponctuation">
			<h3>Ponctuation</h3>
			<p>Cela dépend des choix stylistiques de l'auteur, mais très souvent la ponctuation doit être ignorée - elle sert seulement à la <span class="highlight underline surface">surface</span>.</p>
			<p>Cependant, certaines marques de ponctuation peuvent être un indice sur la nature de l'énigme.</p>
			<p><code>?</code> - un point d'interrogation en fin d'énigme peut parfois indiquer qu'une partie de l'énigme est un peu tirée par les cheveux, par exemple si elle utilise un mot d'une manière non standard (par exemple "couleur" pour dire "quelque chose qui coule").</p>
			<p><code>!</code> - un point d'exclamation en fin d'énigme peut parfois indiquer que l'on a affaire à une énigme tout-en-un.</p>
			<Aside type="warning">
				<template #title>Pas toujours</template>
				<p><code>?</code> et <code>!</code> peuvent parfois être utilisés sans la signification ci-dessus, juste pour la forme.</p>
			</Aside>
		</section>
		<section class="section" id="accents">
			<h3>Accents</h3>
			<p>Il n'y a pas vraiment de standard établi pour la cohérence des accents, par exemple si "début d'été" doit représenter un "é" dans la réponse ou peut aussi représenter un "e" ou "è".</p>
			<p>Cela dit, les accents sont généralement ignorés dans les réponses de mots croisés classiques, il y a donc un argument pour les ignorer.</p>
			<p>Quand vous cherchez une réponse ne partez donc pas du principe que les accents doivent correspondre.</p>
		</section>
		<section class="section" id="mots-à-double-usage">
			<h3>Mots à double usage</h3>
			<p>Comme indiqué plus haut, un <span class="highlight underline color-2">indicateur</span> ne peut pas être sa propre <span class="highlight underline color-1">matière</span>. Cela dit, un même mot peut être coupé en deux, une partie du mot servant d'indicateur pour l'autre partie.</p>
			<p>Par exemple, <span class="highlight underline color-1">mara</span><span class="highlight underline color-2">bout</span> pourrait être le bout de "mara", un A.</p>
		</section>
		<section class="section" id="mots-superflus">
			<h3>Mots superflus</h3>
			<p>Une bonne énigme cryptique n'aura pas de mots superflus. Chaque mot doit servir à la <span class="highlight underline definition">définition</span> ou à la <span class="highlight underline wordplay">recette</span> (en tant qu'<span class="highlight underline color-2">indicateur</span> ou <span class="highlight underline color-1">matière</span>), ou être un <span class="highlight underline linking">mot de liaison</span>.</p>
			<p>Si votre raisonnement vous conduit à un mot n'appartenant à aucune de ces catégories, vous êtes donc sûrement sur la mauvaise piste !</p>
		</section>
		<section class="section" id="outils">
			<h2>Liens utiles</h2>
			<p>Une liste de liens utiles est disponible sur la page <NuxtLink to="/outils">Outils</NuxtLink>.</p>
		</section>
	</main>
</template>

<style scoped>
	.main {
		/* Avoid margin collapsing */
		display: inline-block;
		width: 100%;
		scroll-snap-align: start;
	}
	.page-title {
		font-size: 3rem;
		text-align: center;
		margin: 0;
		small { font-size: .75em; }
	}
	.back, .toc-toggle {
		position: fixed;
		top: 8px; left: 8px;
		background: var(--background);
		border-radius: 50%;
		padding: 4px;
		z-index: 9;
	}
	.toc-toggle {
		left: auto; right: 8px;
		-webkit-tap-highlight-color: transparent;
	}
	@keyframes toc-active { from, to { color: var(--color-primary); } }
	@keyframes toc-entry { to { bottom: 0; } }
	@keyframes toc-exit { to { top: 100%; } }
	#toc {
		inset: 7px 7px auto auto;
		max-height: calc(100dvh - 16px);
		width: max-content;
		max-width: min(100dvw - 16px, 250px);
		padding: 8px;
		border-radius: 8px;
		color: var(--text);
		background: var(--background);
		border: 1px solid color-mix(in oklch, var(--text), transparent 80%);
		box-shadow: 0 4px 4px #0001;
		z-index: 8;
		transition: display .15s allow-discrete, overlay .15s allow-discrete, translate .15s, opacity .15s;
		@starting-style {
			translate: 0 -8px;
			opacity: 0;
		}
		&:not(:popover-open) {
			translate: 0 -8px;
			opacity: 0;
			.close { translate: 0 8px; }
		}
		.close {
			display: block;
			position: relative;
			float: right;
			width: 32px;
			aspect-ratio: 1;
			margin: -8px -8px 0 auto;
			background: inherit;
			border-radius: 50%;
			shape-outside: circle(50%);
			shape-margin: 2px;
			transition: translate .15s;
			z-index: 2;
			@starting-style { translate: 0 8px; }
			&::before, &::after {
				content: '';
				position: absolute;
				inset: 50%;
				width: 16px; height: 1px;
				background: currentColor;
				translate: -50% -50%;
				rotate: 45deg;
			}
			&::after { rotate: -45deg; }
		}
		& ol {
			list-style: none;
			padding: 0;
			margin: 0;
			& ol {
				--depth: 1;
				& ol { --depth: 2; }
			}
		}
		& li a {
			display: block;
			position: relative;
			padding-inline-start: calc(8px + 12px * var(--depth, 0));
			animation: toc-active 1ms linear;
			animation-range: entry 50vh exit calc(100% - 50vh);
			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				bottom: 100%;
				width: 1px;
				background: var(--color-primary-bright);
				animation: toc-entry 1ms linear both, toc-exit 1ms linear both;
				animation-timeline: inherit;
				animation-range: entry 0% entry 100%, exit 0% exit 100%;
			}
			@supports not (animation-timeline: --works) {
				animation: none;
				color: color-mix(currentColor, var(--color-primary) calc(100% * var(--active, 0)));
				&::before {
					animation: none;
					bottom: calc(100% * (1 - var(--entry, 0)));
					top: calc(100% * var(--exit, 0));
				}
			}
		}
	}

	:global(html):has(.section) {
		scroll-snap-type: y mandatory;
	}
	.section {
		max-width: 800px;
		min-height: 100lvh;
		place-content: center;
		margin: 0 auto;
		padding: 48px 16px;
		scroll-snap-align: start;
	}
	@media (pointer: fine) {
		:global(html):has(.section) {
			scroll-snap-type: none;
		}
		.section {
			min-height: 0;
			border-bottom: 1px solid color-mix(in oklch, var(--text), transparent 80%);
		}
	}
	/* 800 for .section max-width + 250 for #toc size */
	@media (width >= 1050px) {
		:global(#root):has(.section) {
			display: flex;
		}
		header {
			order: 1;
		}
		#toc#toc {
			position: sticky;
			display: block;
			top: 0;
			right: auto;
			height: 100dvh;
			max-height: none;
			border: none;
			border-left: 1px solid color-mix(in oklch, var(--text), transparent 80%);
			border-radius: 0;
			opacity: 1;
			translate: 0 0;
			.close { display: none; }
		}
		.toc-toggle { display: none; }
	}
	.highlight {
		--c: #0000;
		background: var(--c);
		border-radius: 2px;
		&.definition { --c: var(--definition); }
		&.surface { --c: var(--hint-5); }
		&.wordplay { --c: var(--hint-3); }
		&.linking { --c: var(--hint-4); }
		&.underline { background: linear-gradient(var(--c) 0 0) 0 100% / 100% 25% no-repeat; }
		&.color-1 { --c: var(--hint-1); }
		&.color-2 { --c: var(--hint-2); }
		&.color-3 { --c: var(--hint-3); }
	}
	@property --intro-scroll-progress {
		syntax: '<number>';
		initial-value: 0;
		inherits: true;
	}
	@keyframes intro-scroll-progress {
		to { --intro-scroll-progress: 8; }
	}
	.intro-slideshow {
		display: grid;
		container-type: inline-size;
		overflow: auto;
		scroll-snap-type: x mandatory;
		scroll-snap-stop: always;
		scroll-timeline: --slide-scroll inline;
		animation: intro-scroll-progress auto linear;
		animation-timeline: --slide-scroll;
		--scroll: var(--intro-scroll-progress);
		@media (prefers-reduced-motion: reduce) {
			--scroll: round(nearest, var(--intro-scroll-progress));
		}
		:global(p) { margin-bottom: .5em; }
		.static {
			position: sticky;
			left: 0;
			top: 0;
			width: 100cqw;
		}
		.clue {
			padding: 16px;
			font-size: 1.25rem;
			border: 4px double var(--light);
			border-radius: 12px;
			corner-shape: bevel;
			.clue-highlight {
				--c: #0000;
				--keep: 0;
				--p: clamp(0, var(--scroll) - var(--at, -1) + 0.5, 1 - var(--keep) * .5);
				--underline: 0;
				background: linear-gradient(to right, #0000 33.3333%, var(--c) 0 66.6666%, #0000 0) calc(100% * (1 - var(--p))) 100% / 300% calc(100% - 75% * var(--underline)) no-repeat;
				border-radius: 4px;
			}
			.length       { --c: var(--hint-6); --at: 1; }
			.surface      { --c: var(--hint-5); --at: 2; }
			.definition   { --c: var(--definition); --at: 3; }
			.wordplay     { --c: var(--hint-3); --at: 4; }
			.linking      { --c: var(--hint-4); --at: 5; }
			.indicator-1  { --c: var(--hint-1); --at: 6; --underline: 1; --keep: 1; }
			.fodder-1     { --c: var(--hint-1); --at: 5.5; }
			.fodder-1-sel { --c: var(--hint-1); --at: 6; --keep: 1; }
			.indicator-2  { --c: var(--hint-2); --at: 7; --underline: 1; --keep: 1; }
			.fodder-2     { --c: var(--hint-2); --at: 7; --keep: 1; }
			.indicator-3  { --c: var(--hint-3); --at: 8; --underline: 1; --keep: 1; }
		}
		.answer {
			position: relative;
			display: flex;
			font-size: 1.5rem;
			font-weight: 600;
			--ch: 1.5em;
			width: calc(4 * var(--ch));
			height: var(--ch);
			margin: 8px auto;
			border: 2px solid;
			box-sizing: content-box;
			border-radius: 4px;
			background:
				linear-gradient(var(--background) 0 0) 0 0 / 1px 100% no-repeat,
				linear-gradient(to right, currentColor 1px, #0000 0) 0 0 / var(--ch) 100%;
			overflow: clip;
			--show: clamp(0, (var(--scroll) - .8) / .2, 1);
			opacity: var(--show);
			translate: 0 calc(-8px * (var(--show) - 1));
			.letter {
				position: absolute;
				width: var(--ch);
				height: var(--ch);
				text-align: center;
				align-content: center;
				@media (prefers-reduced-motion: reduce) {
					animation-timing-function: step-end;
				}
				&::after { content: ''; position: absolute; inset: -1px; border: 1px solid; }

				&.a {
					background: var(--hint-2);
					opacity: clamp(0, var(--scroll) - 6, 1);
					translate:
						calc(200% - 100% * clamp(0, (var(--scroll) - 6.6) / .4, 1) - 100% * clamp(0, var(--scroll) - 7, 1))
						calc(-100% + 100% * clamp(0, (var(--scroll) - 6) / .6, 1));
				}
				&.m {
					background: var(--hint-2);
					opacity: clamp(0, var(--scroll) - 6, 1);
					translate:
						calc(100% + 100% * clamp(0, (var(--scroll) - 6.6) / .4, 1) - 100% * clamp(0, var(--scroll) - 7, 1))
						calc(-100% + 100% * clamp(0, (var(--scroll) - 6) / .6, 1));
				}
				&.i {
					background: var(--hint-2);
					opacity: clamp(0, var(--scroll) - 6, 1);
					translate:
						calc(300% - 100% * clamp(0, var(--scroll) - 7, 1))
						calc(-100% + 100% * clamp(0, (var(--scroll) - 6) / .6, 1));
				}
				&.e {
					background: var(--hint-1);
					opacity: clamp(0, var(--scroll) - 5, 1);
					translate:
						calc(300% * clamp(0, var(--scroll) - 7, 1))
						calc(-100% + 100% * clamp(0, var(--scroll) - 5, 1));
				}
			}
		}
		.slides {
			display: flex;
			counter-reset: slides;
			margin-block: 8px;
		}
		.slide {
			counter-increment: slides;
			width: 100cqw;
			scroll-snap-align: center;
		}
		.slide:first-child::after {
			content: 'défilez à droite pour continuer';
			display: block;
			text-align: center;
			font-size: smaller;
			color: var(--note);
		}
		.navigation {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 12px;
			&::before, &::after {
				content: '';
				width: 8px;
				height: 8px;
				border: 2px solid;
				border-color: currentColor currentColor #0000 #0000;
			}
			&::before { rotate: -135deg; opacity: clamp(0, var(--scroll) * 10, 1); }
			&::after { rotate: 45deg; opacity: clamp(0, (8 - var(--scroll)) * 10, 1); }
			.page {
				margin: 0 8px;
				&::before {
					counter-reset: active-slide calc(1 + var(--scroll));
					content: counter(active-slide) ' / ' counter(slides);
				}
			}
		}
	}
	.main a {
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.main code {
		border: 1px solid color-mix(currentColor, transparent 80%);
		border-radius: 4px;
		padding: .1em .2em;
	}
	.main em {
		font-style: normal;
		text-decoration: underline;
		text-decoration-style: wavy;
		text-decoration-color: color-mix(in srgb, currentColor, transparent 50%);
	}
	.main details {
		&::details-content {
			background: linear-gradient(color-mix(currentColor, transparent 90%) 0 0) .75rem 0 / 1px 100% no-repeat;
			height: 0;
			padding: 0;
			overflow: clip;
			interpolate-size: allow-keywords;
			transition: height .15s, padding .05s, content-visibility .15s allow-discrete;
			@media (prefers-reduced-motion: reduce) {
				transition: none;
			}
		}
		&[open]::details-content { height: auto; padding: 1px 0; }
		summary {
			text-decoration: underline dashed 1px color-mix(in srgb, currentColor 50%, #0000);
			text-underline-offset: 2px;
			border-radius: 4px;
			cursor: pointer;
			transition: text-underline-offset .2s, text-decoration-color .2s;
			&::marker { font-size: .75em; }
			&:hover {
				/* background: rgb(255 255 255 / .05); */
				text-decoration-color: currentColor;
				text-decoration-style: solid;
				text-underline-offset: 3px;
			}
		}
		p {
			font-size: .9rem;
			margin-block: .5em;
			padding-inline-start: calc(.75rem + 8px);
		}
	}
	.expandable {
		list-style: none;
		padding: 0;
	}
</style>