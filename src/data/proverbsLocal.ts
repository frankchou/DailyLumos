// 本地備份箴言資料 - 每章精選節次，作為 API 失敗時的 Fallback
export interface LocalVerse {
  chapter: number
  verse: number
  text: string
}

export const PROVERBS_LOCAL: LocalVerse[] = [
  // 第 1 章
  { chapter: 1, verse: 7, text: '敬畏耶和華是知識的開端；愚妄人藐視智慧和訓誨。' },
  { chapter: 1, verse: 33, text: '惟有聽從我的，必安然居住，得享安靜，不怕災禍。' },
  // 第 2 章
  { chapter: 2, verse: 6, text: '因為耶和華賜人智慧；知識和聰明都由祂口而出。' },
  { chapter: 2, verse: 10, text: '智慧必入你心，你的靈知識是可喜愛的。' },
  // 第 3 章
  { chapter: 3, verse: 5, text: '你要專心仰賴耶和華，不可倚靠自己的聰明；' },
  { chapter: 3, verse: 6, text: '在你一切所行的事上，都要認定祂，祂必指引你的路。' },
  { chapter: 3, verse: 13, text: '得智慧、得聰明的，這人便為有福。' },
  // 第 4 章
  { chapter: 4, verse: 7, text: '智慧為首；所以，你要得智慧，在你一切所得之中，要得聰明。' },
  { chapter: 4, verse: 18, text: '但義人的路好像黎明的光，越照越明，直到日午。' },
  { chapter: 4, verse: 23, text: '你要保守你心，勝過保守一切，因為一生的果效，是由心發出。' },
  // 第 5 章
  { chapter: 5, verse: 21, text: '因為人所行的路都在耶和華眼前；祂也修平人一切的路。' },
  // 第 6 章
  { chapter: 6, verse: 6, text: '懶惰人哪，你去察看螞蟻的動作就可得智慧。' },
  { chapter: 6, verse: 23, text: '因為誡命是燈，法則是光，訓誨的責備是生命的道。' },
  // 第 7 章
  { chapter: 7, verse: 2, text: '遵守我的命令就得存活；保守我的法則，如同保護眼中的瞳人。' },
  // 第 8 章
  { chapter: 8, verse: 11, text: '原來智慧比珍珠更美；一切可喜愛的都不足與比較。' },
  { chapter: 8, verse: 17, text: '愛我的，我也愛他；懇切尋找我的，必尋得見。' },
  { chapter: 8, verse: 35, text: '因為尋得我的，就尋得生命，也必蒙耶和華的恩惠。' },
  // 第 9 章
  { chapter: 9, verse: 10, text: '敬畏耶和華是智慧的開端；認識至聖者便是聰明。' },
  { chapter: 9, verse: 11, text: '我智慧必使你的日子加多，你生命的年歲也必增添。' },
  // 第 10 章
  { chapter: 10, verse: 12, text: '恨能挑起爭端；愛能遮掩一切過錯。' },
  { chapter: 10, verse: 22, text: '耶和華所賜的福使人富足，並不加上憂慮。' },
  { chapter: 10, verse: 28, text: '義人的盼望，必得歡樂；惡人的指望，必致滅沒。' },
  // 第 11 章
  { chapter: 11, verse: 2, text: '驕傲來，羞恥也來；謙遜人卻有智慧。' },
  { chapter: 11, verse: 14, text: '謀略不定，民就敗落；謀士眾多，人便安居。' },
  { chapter: 11, verse: 25, text: '好施散的，越發富足；吝嗇的，轉趨貧乏。' },
  // 第 12 章
  { chapter: 12, verse: 4, text: '才德的婦人是丈夫的冠冕；貽羞的婦人，如同朽爛在她丈夫的骨中。' },
  { chapter: 12, verse: 25, text: '人心憂慮，屈而不伸；一句良言，使心歡樂。' },
  // 第 13 章
  { chapter: 13, verse: 12, text: '所盼望的遲延未得，令人心憂；所願意的臨到，卻是生命樹。' },
  { chapter: 13, verse: 20, text: '與智慧人同行的，必得智慧；和愚昧人作伴的，必受虧損。' },
  // 第 14 章
  { chapter: 14, verse: 29, text: '不輕易發怒的，大有聰明；性情暴躁的，大顯愚妄。' },
  { chapter: 14, verse: 30, text: '心中安靜是肉體的生命；嫉妒是骨中的朽爛。' },
  // 第 15 章
  { chapter: 15, verse: 1, text: '回答柔和，使怒消退；言語暴戾，觸動怒氣。' },
  { chapter: 15, verse: 13, text: '心中喜樂，面帶笑容；心裡憂愁，靈被損傷。' },
  { chapter: 15, verse: 23, text: '口善應對，自覺喜樂；話合其時，何等美好。' },
  // 第 16 章
  { chapter: 16, verse: 3, text: '你所做的事，都當交託耶和華，你所謀的就必成立。' },
  { chapter: 16, verse: 9, text: '人心籌算自己的道路；惟耶和華指引他的腳步。' },
  { chapter: 16, verse: 18, text: '驕傲在敗壞以先；狂心在跌倒之前。' },
  { chapter: 16, verse: 24, text: '良言如同蜂房，使心覺甘甜，使骨得醫治。' },
  // 第 17 章
  { chapter: 17, verse: 17, text: '朋友乃時常親愛；弟兄為患難而生。' },
  { chapter: 17, verse: 22, text: '喜樂的心，乃是良藥；憂傷的靈，使骨枯乾。' },
  // 第 18 章
  { chapter: 18, verse: 10, text: '耶和華的名是堅固臺；義人奔入便得安全。' },
  { chapter: 18, verse: 21, text: '生死在舌頭的權下；喜愛它的，必吃它所結的果子。' },
  // 第 19 章
  { chapter: 19, verse: 11, text: '人有見識，就不輕易發怒；寬恕人的過失，便是自己的榮耀。' },
  { chapter: 19, verse: 21, text: '人心多有計謀；惟有耶和華的籌算，才能立定。' },
  // 第 20 章
  { chapter: 20, verse: 7, text: '行為純正的義人，他的子孫是有福的。' },
  { chapter: 20, verse: 24, text: '人的腳步為耶和華所定；人豈能明白自己的路呢？' },
  // 第 21 章
  { chapter: 21, verse: 2, text: '人所行的路，自己看來都是正直；惟有耶和華衡量人心。' },
  { chapter: 21, verse: 21, text: '追求公義仁慈的，就尋得生命、公義和尊榮。' },
  // 第 22 章
  { chapter: 22, verse: 1, text: '美名勝過大財；恩寵強如金銀。' },
  { chapter: 22, verse: 6, text: '教養孩童，使他走當行的道，就是到老他也不偏離。' },
  { chapter: 22, verse: 9, text: '眼目慈善的，就必蒙福，因他將食物分給窮人。' },
  // 第 23 章
  { chapter: 23, verse: 7, text: '因為他心怎樣思量，他為人就是怎樣。' },
  { chapter: 23, verse: 26, text: '我兒，要將你的心歸我；你的眼目也當喜悅我的道路。' },
  // 第 24 章
  { chapter: 24, verse: 16, text: '因為義人雖七次跌倒，仍必興起；惡人卻被禍患傾倒。' },
  // 第 25 章
  { chapter: 25, verse: 11, text: '一句話說得合宜，就如金蘋果在銀網子裏。' },
  { chapter: 25, verse: 13, text: '忠信的使者叫差他的人心平，就如在收割時有冰雪的涼氣。' },
  // 第 26 章
  { chapter: 26, verse: 12, text: '你見自以為有智慧的人嗎？愚昧人比他更有指望。' },
  // 第 27 章
  { chapter: 27, verse: 1, text: '不要為明日自誇，因為一日要生何事，你尚且不能知道。' },
  { chapter: 27, verse: 17, text: '鐵磨鐵，磨出刃來；朋友相感，感出才來。' },
  // 第 28 章
  { chapter: 28, verse: 13, text: '遮掩自己罪過的，必不亨通；承認離棄罪過的，必蒙憐恤。' },
  { chapter: 28, verse: 25, text: '心存驕傲的，挑起爭端；倚靠耶和華的，必得豐盛。' },
  // 第 29 章
  { chapter: 29, verse: 11, text: '愚妄人怒氣全發；智慧人忍氣含怒。' },
  { chapter: 29, verse: 25, text: '懼怕人的，陷入網羅；惟有倚靠耶和華的，必得安穩。' },
  // 第 30 章
  { chapter: 30, verse: 5, text: '神的言語句句都是煉淨的；投靠祂的，祂便作他們的盾牌。' },
  // 第 31 章
  { chapter: 31, verse: 25, text: '能力和威儀是她的衣服；她想到日後的景況便喜笑。' },
  { chapter: 31, verse: 30, text: '艷麗是虛假的，美容是虛浮的；惟敬畏耶和華的婦女，必得稱讚。' },
]

export function getLocalVerse(chapter: number, verse: number): LocalVerse | undefined {
  // 先精確匹配
  const exact = PROVERBS_LOCAL.find((v) => v.chapter === chapter && v.verse === verse)
  if (exact) return exact
  // 否則取該章任意一節
  const sameChapter = PROVERBS_LOCAL.filter((v) => v.chapter === chapter)
  if (sameChapter.length > 0) return sameChapter[Math.floor(Math.random() * sameChapter.length)]
  // 最後隨機一節
  return PROVERBS_LOCAL[Math.floor(Math.random() * PROVERBS_LOCAL.length)]
}
