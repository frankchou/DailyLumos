// 本地精選經文 — bible-api.com 失敗時的後備
// 涵蓋 66 卷書中的代表性金句（和合本）
// 注意：文字以和合本為底盡量精確；若發現用字差異，直接改這裡即可

export interface LocalVerse {
  book: string // OSIS 3 碼
  chapter: number
  verse: number
  text: string
}

export const BIBLE_VERSES_LOCAL: LocalVerse[] = [
  // ── 摩西五經 ──────────────────────────────────────────
  { book: 'GEN', chapter: 1, verse: 1, text: '起初，神創造天地。' },
  { book: 'GEN', chapter: 1, verse: 27, text: '神就照著自己的形像造人，乃是照著祂的形像造男造女。' },
  { book: 'GEN', chapter: 12, verse: 2, text: '我必叫你成為大國。我必賜福給你，叫你的名為大；你也要叫別人得福。' },
  { book: 'EXO', chapter: 14, verse: 14, text: '耶和華必為你們爭戰；你們只管靜默，不要作聲。' },
  { book: 'EXO', chapter: 20, verse: 12, text: '當孝敬父母，使你的日子在耶和華你神所賜你的地上得以長久。' },
  { book: 'LEV', chapter: 19, verse: 18, text: '要愛人如己。我是耶和華。' },
  { book: 'NUM', chapter: 6, verse: 24, text: '願耶和華賜福給你，保護你。' },
  { book: 'NUM', chapter: 6, verse: 25, text: '願耶和華使祂的臉光照你，賜恩給你。' },
  { book: 'NUM', chapter: 6, verse: 26, text: '願耶和華向你仰臉，賜你平安。' },
  { book: 'DEU', chapter: 6, verse: 5, text: '你要盡心、盡性、盡力愛耶和華你的神。' },
  { book: 'DEU', chapter: 31, verse: 6, text: '你們當剛強壯膽，不要害怕，也不要畏懼他們，因為耶和華你的神和你同去；祂必不撇下你，也不丟棄你。' },

  // ── 歷史書 ────────────────────────────────────────────
  { book: 'JOS', chapter: 1, verse: 9, text: '你當剛強壯膽！不要懼怕，也不要驚惶；因為你無論往哪裡去，耶和華你的神必與你同在。' },
  { book: 'JOS', chapter: 24, verse: 15, text: '至於我和我家，我們必定事奉耶和華。' },
  { book: 'JDG', chapter: 6, verse: 12, text: '耶和華與你同在，大能的勇士啊！' },
  { book: 'RUT', chapter: 1, verse: 16, text: '你往哪裡去，我也往哪裡去；你在哪裡住宿，我也在哪裡住宿；你的國就是我的國，你的神就是我的神。' },
  { book: '1SA', chapter: 16, verse: 7, text: '耶和華不像人看人：人是看外貌；耶和華是看內心。' },
  { book: '2SA', chapter: 22, verse: 31, text: '至於神，祂的道是完全的；耶和華的話是煉淨的。凡投靠祂的，祂便作他們的盾牌。' },
  { book: '1KI', chapter: 19, verse: 12, text: '地震後有火，耶和華也不在火中；火後有微小的聲音。' },
  { book: '2KI', chapter: 6, verse: 16, text: '不要懼怕！與我們同在的比與他們同在的更多。' },
  { book: '1CH', chapter: 16, verse: 11, text: '要尋求耶和華與祂的能力，時常尋求祂的面。' },
  { book: '2CH', chapter: 7, verse: 14, text: '這稱為我名下的子民，若是自卑、禱告，尋求我的面，轉離他們的惡行，我必從天上垂聽，赦免他們的罪，醫治他們的地。' },
  { book: 'EZR', chapter: 8, verse: 22, text: '我們神施恩的手必幫助一切尋求祂的；但祂的能力和忿怒必攻擊一切離棄祂的。' },
  { book: 'NEH', chapter: 8, verse: 10, text: '不要憂愁，因靠耶和華而得的喜樂是你們的力量。' },
  { book: 'EST', chapter: 4, verse: 14, text: '焉知你得了王后的位分不是為現今的機會嗎？' },

  // ── 智慧/詩歌書 ───────────────────────────────────────
  { book: 'JOB', chapter: 19, verse: 25, text: '我知道我的救贖主活著，末了必站立在地上。' },
  { book: 'JOB', chapter: 23, verse: 10, text: '然而祂知道我所行的路；祂試煉我之後，我必如精金。' },
  { book: 'PSA', chapter: 1, verse: 1, text: '不從惡人的計謀，不站罪人的道路，不坐褻慢人的座位。' },
  { book: 'PSA', chapter: 23, verse: 1, text: '耶和華是我的牧者，我必不致缺乏。' },
  { book: 'PSA', chapter: 27, verse: 1, text: '耶和華是我的亮光，是我的拯救，我還怕誰呢？耶和華是我性命的保障，我還懼誰呢？' },
  { book: 'PSA', chapter: 46, verse: 1, text: '神是我們的避難所，是我們的力量，是我們在患難中隨時的幫助。' },
  { book: 'PSA', chapter: 46, verse: 10, text: '你們要休息，要知道我是神！我必在外邦中被尊崇，在遍地上也被尊崇。' },
  { book: 'PSA', chapter: 91, verse: 1, text: '住在至高者隱密處的，必住在全能者的蔭下。' },
  { book: 'PSA', chapter: 119, verse: 105, text: '你的話是我腳前的燈，是我路上的光。' },
  { book: 'PSA', chapter: 121, verse: 1, text: '我要向山舉目；我的幫助從何而來？' },
  { book: 'PSA', chapter: 139, verse: 14, text: '我要稱謝你，因我受造，奇妙可畏；你的作為奇妙，這是我心深知道的。' },
  { book: 'PRO', chapter: 3, verse: 5, text: '你要專心仰賴耶和華，不可倚靠自己的聰明。' },
  { book: 'PRO', chapter: 3, verse: 6, text: '在你一切所行的事上，都要認定祂，祂必指引你的路。' },
  { book: 'PRO', chapter: 4, verse: 23, text: '你要保守你心，勝過保守一切，因為一生的果效，是由心發出。' },
  { book: 'PRO', chapter: 16, verse: 9, text: '人心籌算自己的道路；惟耶和華指引他的腳步。' },
  { book: 'PRO', chapter: 27, verse: 17, text: '鐵磨鐵，磨出刃來；朋友相感也是如此。' },
  { book: 'ECC', chapter: 3, verse: 1, text: '凡事都有定期，天下萬務都有定時。' },
  { book: 'ECC', chapter: 12, verse: 13, text: '敬畏神，謹守祂的誡命，這是人所當盡的本分。' },
  { book: 'SNG', chapter: 2, verse: 11, text: '因為冬天已往，雨水止住過去了。' },
  { book: 'SNG', chapter: 8, verse: 7, text: '愛情，眾水不能息滅，大水也不能淹沒。' },

  // ── 大先知書 ──────────────────────────────────────────
  { book: 'ISA', chapter: 9, verse: 6, text: '因有一嬰孩為我們而生；有一子賜給我們。政權必擔在祂的肩頭上；祂名稱為「奇妙策士、全能的神、永在的父、和平的君」。' },
  { book: 'ISA', chapter: 40, verse: 31, text: '但那等候耶和華的必從新得力。他們必如鷹展翅上騰；他們奔跑卻不困倦，行走卻不疲乏。' },
  { book: 'ISA', chapter: 41, verse: 10, text: '你不要害怕，因為我與你同在；不要驚惶，因為我是你的神。我必堅固你，我必幫助你；我必用我公義的右手扶持你。' },
  { book: 'ISA', chapter: 43, verse: 2, text: '你從水中經過，我必與你同在；你蹚過江河，水必不漫過你；你從火中行過，必不被燒，火焰也不著在你身上。' },
  { book: 'ISA', chapter: 53, verse: 5, text: '哪知祂為我們的過犯受害，為我們的罪孽壓傷。因祂受的刑罰，我們得平安；因祂受的鞭傷，我們得醫治。' },
  { book: 'JER', chapter: 29, verse: 11, text: '耶和華說：我知道我向你們所懷的意念是賜平安的意念，不是降災禍的意念，要叫你們末後有指望。' },
  { book: 'JER', chapter: 33, verse: 3, text: '你求告我，我就應允你，並將你所不知道、又大又難的事指示你。' },
  { book: 'LAM', chapter: 3, verse: 22, text: '我們不致消滅，是出於耶和華諸般的慈愛；是因祂的憐憫不致斷絕。' },
  { book: 'LAM', chapter: 3, verse: 23, text: '每早晨，這都是新的；你的誠實極其廣大！' },
  { book: 'EZK', chapter: 36, verse: 26, text: '我也要賜給你們一個新心，將新靈放在你們裡面，又從你們的肉體中除掉石心，賜給你們肉心。' },
  { book: 'DAN', chapter: 3, verse: 17, text: '即便如此，我們所事奉的神能將我們從烈火的窯中救出來。' },

  // ── 小先知書 ──────────────────────────────────────────
  { book: 'HOS', chapter: 6, verse: 6, text: '我喜愛良善，不喜愛祭祀；喜愛認識神，勝於燔祭。' },
  { book: 'JOL', chapter: 2, verse: 28, text: '以後，我要將我的靈澆灌凡有血氣的。' },
  { book: 'AMO', chapter: 5, verse: 24, text: '惟願公平如大水滾滾，使公義如江河滔滔。' },
  { book: 'OBA', chapter: 1, verse: 15, text: '耶和華降罰的日子臨近萬國。你怎樣行，祂也必照樣向你行；你的報應必歸到你頭上。' },
  { book: 'JON', chapter: 2, verse: 9, text: '救恩出於耶和華。' },
  { book: 'MIC', chapter: 6, verse: 8, text: '世人哪，耶和華已指示你何為善。祂向你所要的是甚麼呢？只要你行公義，好憐憫，存謙卑的心，與你的神同行。' },
  { book: 'NAM', chapter: 1, verse: 7, text: '耶和華本為善，在患難的日子為人的保障，並且認得那些投靠祂的人。' },
  { book: 'HAB', chapter: 3, verse: 17, text: '雖然無花果樹不發旺，葡萄樹不結果，橄欖樹也不效力，田地不出糧食，圈中絕了羊，棚內也沒有牛。' },
  { book: 'HAB', chapter: 3, verse: 18, text: '然而，我要因耶和華歡欣，因救我的神喜樂。' },
  { book: 'ZEP', chapter: 3, verse: 17, text: '耶和華你的神是施行拯救、大有能力的主。祂在你中間必因你歡欣喜樂，默然愛你，且因你喜樂而歡呼。' },
  { book: 'HAG', chapter: 2, verse: 9, text: '這殿後來的榮耀必大過先前的榮耀；在這地方我必賜平安。這是萬軍之耶和華說的。' },
  { book: 'ZEC', chapter: 4, verse: 6, text: '不是倚靠勢力，不是倚靠才能，乃是倚靠我的靈方能成事。這是萬軍之耶和華說的。' },
  { book: 'MAL', chapter: 3, verse: 10, text: '萬軍之耶和華說：你們要將當納的十分之一全然送入倉庫，使我家有糧，以此試試我，是否為你們敞開天上的窗戶，傾福與你們，甚至無處可容。' },

  // ── 福音書 ────────────────────────────────────────────
  { book: 'MAT', chapter: 5, verse: 14, text: '你們是世上的光。城造在山上是不能隱藏的。' },
  { book: 'MAT', chapter: 6, verse: 33, text: '你們要先求祂的國和祂的義，這些東西都要加給你們了。' },
  { book: 'MAT', chapter: 11, verse: 28, text: '凡勞苦擔重擔的人可以到我這裡來，我就使你們得安息。' },
  { book: 'MAT', chapter: 28, verse: 20, text: '凡我所吩咐你們的，都教訓他們遵守，我就常與你們同在，直到世界的末了。' },
  { book: 'MRK', chapter: 10, verse: 27, text: '在人是不能，在神卻不然，因為神凡事都能。' },
  { book: 'MRK', chapter: 12, verse: 30, text: '你要盡心、盡性、盡意、盡力愛主你的神。' },
  { book: 'LUK', chapter: 1, verse: 37, text: '因為，出於神的話，沒有一句不帶能力的。' },
  { book: 'LUK', chapter: 6, verse: 38, text: '你們要給人，就必有給你們的，並且用十足的升斗，連搖帶按，上尖下流地倒在你們懷裡。' },
  { book: 'JHN', chapter: 3, verse: 16, text: '神愛世人，甚至將祂的獨生子賜給他們，叫一切信祂的，不至滅亡，反得永生。' },
  { book: 'JHN', chapter: 14, verse: 6, text: '我就是道路、真理、生命；若不藉著我，沒有人能到父那裡去。' },
  { book: 'JHN', chapter: 14, verse: 27, text: '我留下平安給你們；我將我的平安賜給你們。我所賜的，不像世人所賜的。你們心裡不要憂愁，也不要膽怯。' },
  { book: 'JHN', chapter: 15, verse: 5, text: '我是葡萄樹，你們是枝子。常在我裡面的，我也常在他裡面，這人就多結果子；因為離了我，你們就不能做甚麼。' },
  { book: 'JHN', chapter: 16, verse: 33, text: '在世上，你們有苦難；但你們可以放心，我已經勝了世界。' },

  // ── 使徒行傳 + 書信 ───────────────────────────────────
  { book: 'ACT', chapter: 1, verse: 8, text: '但聖靈降臨在你們身上，你們就必得著能力，並要在耶路撒冷、猶太全地，和撒馬利亞，直到地極，作我的見證。' },
  { book: 'ACT', chapter: 16, verse: 31, text: '當信主耶穌，你和你一家都必得救。' },
  { book: 'ROM', chapter: 5, verse: 8, text: '惟有基督在我們還作罪人的時候為我們死，神的愛就在此向我們顯明了。' },
  { book: 'ROM', chapter: 8, verse: 28, text: '我們曉得萬事都互相效力，叫愛神的人得益處，就是按祂旨意被召的人。' },
  { book: 'ROM', chapter: 12, verse: 2, text: '不要效法這個世界，只要心意更新而變化，叫你們察驗何為神的善良、純全、可喜悅的旨意。' },
  { book: '1CO', chapter: 10, verse: 13, text: '神是信實的，必不叫你們受試探過於所能受的；在受試探的時候，總要給你們開一條出路，叫你們能忍受得住。' },
  { book: '1CO', chapter: 13, verse: 4, text: '愛是恆久忍耐，又有恩慈；愛是不嫉妒；愛是不自誇，不張狂。' },
  { book: '1CO', chapter: 13, verse: 13, text: '如今常存的有信，有望，有愛這三樣，其中最大的是愛。' },
  { book: '2CO', chapter: 5, verse: 17, text: '若有人在基督裡，他就是新造的人，舊事已過，都變成新的了。' },
  { book: '2CO', chapter: 12, verse: 9, text: '我的恩典夠你用的，因為我的能力是在人的軟弱上顯得完全。' },
  { book: 'GAL', chapter: 2, verse: 20, text: '我已經與基督同釘十字架，現在活著的不再是我，乃是基督在我裡面活著。' },
  { book: 'GAL', chapter: 5, verse: 22, text: '聖靈所結的果子，就是仁愛、喜樂、和平、忍耐、恩慈、良善、信實。' },
  { book: 'EPH', chapter: 2, verse: 8, text: '你們得救是本乎恩，也因著信；這並不是出於自己，乃是神所賜的。' },
  { book: 'EPH', chapter: 6, verse: 10, text: '我還有末了的話：你們要靠著主，倚賴祂的大能大力作剛強的人。' },
  { book: 'PHP', chapter: 4, verse: 6, text: '應當一無掛慮，只要凡事藉著禱告、祈求，和感謝，將你們所要的告訴神。' },
  { book: 'PHP', chapter: 4, verse: 13, text: '我靠著那加給我力量的，凡事都能做。' },
  { book: 'COL', chapter: 3, verse: 23, text: '無論做甚麼，都要從心裡做，像是給主做的，不是給人做的。' },
  { book: '1TH', chapter: 5, verse: 16, text: '要常常喜樂。' },
  { book: '1TH', chapter: 5, verse: 17, text: '不住地禱告。' },
  { book: '1TH', chapter: 5, verse: 18, text: '凡事謝恩，因為這是神在基督耶穌裡向你們所定的旨意。' },
  { book: '2TH', chapter: 3, verse: 3, text: '但主是信實的，要堅固你們，保護你們脫離那惡者。' },
  { book: '1TI', chapter: 4, verse: 12, text: '不可叫人小看你年輕，總要在言語、行為、愛心、信心、清潔上，都作信徒的榜樣。' },
  { book: '2TI', chapter: 1, verse: 7, text: '因為神賜給我們，不是膽怯的心，乃是剛強、仁愛、謹守的心。' },
  { book: '2TI', chapter: 3, verse: 16, text: '聖經都是神所默示的，於教訓、督責、使人歸正、教導人學義都是有益的。' },
  { book: 'TIT', chapter: 3, verse: 5, text: '祂便救了我們，並不是因我們自己所行的義，乃是照祂的憐憫。' },
  { book: 'PHM', chapter: 1, verse: 7, text: '兄弟啊，我為你的愛心，大有快樂，大得安慰，因眾聖徒的心從你得了暢快。' },
  { book: 'HEB', chapter: 11, verse: 1, text: '信就是所望之事的實底，是未見之事的確據。' },
  { book: 'HEB', chapter: 12, verse: 2, text: '仰望為我們信心創始成終的耶穌。' },
  { book: 'HEB', chapter: 13, verse: 8, text: '耶穌基督，昨日、今日、一直到永遠，是一樣的。' },
  { book: 'JAS', chapter: 1, verse: 5, text: '你們中間若有缺少智慧的，應當求那厚賜與眾人、也不斥責人的神，主就必賜給他。' },
  { book: 'JAS', chapter: 1, verse: 17, text: '各樣美善的恩賜和各樣全備的賞賜都是從上頭來的，從眾光之父那裡降下來的；在祂並沒有改變，也沒有轉動的影兒。' },
  { book: 'JAS', chapter: 4, verse: 8, text: '你們親近神，神就必親近你們。' },
  { book: '1PE', chapter: 5, verse: 7, text: '你們要將一切的憂慮卸給神，因為祂顧念你們。' },
  { book: '2PE', chapter: 3, verse: 9, text: '主所應許的尚未成就，有人以為祂是耽延，其實不是耽延，乃是寬容你們，不願有一人沉淪，乃願人人都悔改。' },
  { book: '1JN', chapter: 1, verse: 9, text: '我們若認自己的罪，神是信實的，是公義的，必要赦免我們的罪，洗淨我們一切的不義。' },
  { book: '1JN', chapter: 4, verse: 7, text: '親愛的弟兄啊，我們應當彼此相愛，因為愛是從神來的。' },
  { book: '1JN', chapter: 4, verse: 19, text: '我們愛，因為神先愛我們。' },
  { book: '2JN', chapter: 1, verse: 6, text: '我們若照祂的命令行，這就是愛。' },
  { book: '3JN', chapter: 1, verse: 4, text: '我聽見我的兒女們按真理而行，我的喜樂就沒有比這個大的。' },
  { book: 'JUD', chapter: 1, verse: 24, text: '那能保守你們不失腳、叫你們無瑕無疵、歡歡喜喜站在祂榮耀之前的我們的救主獨一的神。' },

  // ── 啟示錄 ────────────────────────────────────────────
  { book: 'REV', chapter: 3, verse: 20, text: '看哪，我站在門外叩門，若有聽見我聲音就開門的，我要進到他那裡去，我與他、他與我一同坐席。' },
  { book: 'REV', chapter: 21, verse: 4, text: '神要擦去他們一切的眼淚；不再有死亡，也不再有悲哀、哭號、疼痛，因為以前的事都過去了。' },
  { book: 'REV', chapter: 22, verse: 13, text: '我是阿拉法，我是俄梅戛；我是首先的，我是末後的；我是初，我是終。' },
]

/**
 * 隨機選一節本地經文（API 失敗時用）
 */
export function getRandomLocalVerse(): LocalVerse {
  const idx = Math.floor(Math.random() * BIBLE_VERSES_LOCAL.length)
  return BIBLE_VERSES_LOCAL[idx]!
}
