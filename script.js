'use strict';
const views = {
  open: {image:'assets/device-open.png',alt:'뒷면 원판을 열어 소리를 채집하는 HUM 제품 설계',state:'01 / RECORDING ON',title:'바깥의 소리에 귀 기울이세요.',description:'원판을 열면 주변의 소리를 채집하는 순간이 시작됩니다. 화면 대신 지금 머무는 공간을 바라보세요.'},
  closed: {image:'assets/device-closed.png',alt:'뒷면 원판을 닫아 소리 채집을 마친 HUM 제품 설계',state:'02 / RECORDING OFF',title:'하나의 순간을 간직하세요.',description:'원판을 닫으면 채집을 마칩니다. 방금 들었던 소리가 오늘의 감각으로 남고, 다시 돌아볼 하나의 기록이 됩니다.'}
};
document.querySelectorAll('[data-mode]').forEach(button => {
  button.addEventListener('click', () => {
    const view = views[button.dataset.mode];
    document.querySelectorAll('[data-mode]').forEach(other => other.setAttribute('aria-pressed',String(other === button)));
    const image = document.getElementById('interaction-image');
    image.src = view.image;
    image.alt = view.alt;
    document.getElementById('interaction-state').textContent = view.state;
    document.getElementById('interaction-title').textContent = view.title;
    document.getElementById('interaction-description').textContent = view.description;
  });
});
document.getElementById('interaction-title').setAttribute('aria-live','polite');

// Motion belongs to the viewer: respect reduced motion and pause off screen.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const heroVideo = document.getElementById('hero-video');
const labVideo = document.getElementById('lab-video');
const heroToggle = document.getElementById('hero-motion');
const labToggle = document.getElementById('lab-play');
const loading = document.getElementById('stage-loading');
let heroWantsMotion = !reducedMotion.matches;
let labWantsMotion = !reducedMotion.matches;
let heroInView = false;
let labInView = false;
let selected = ['b1','c1'];
let currentPair = 'b1c1';
const fragments = ['a1','a2','b1','b2','c1','c2'];
const pairs = fragments.flatMap((first,i) => fragments.slice(i+1).map(second => first+second));
const playSafely = video => video.play().catch(() => { /* Posters remain visible when autoplay is blocked. */ });
function syncPlayback(){
  if(document.hidden || introDialog.open){heroVideo.pause();labVideo.pause();return;}
  if(heroWantsMotion && heroInView) playSafely(heroVideo); else heroVideo.pause();
  if(labWantsMotion && labInView && selected.length===2) playSafely(labVideo); else labVideo.pause();
}
function updatePlaybackLabels(){
  heroToggle.innerHTML = heroVideo.paused ? '모션 재생 <span aria-hidden="true">▷</span>' : '모션 멈추기 <span aria-hidden="true">Ⅱ</span>';
  heroToggle.setAttribute('aria-label',heroVideo.paused?'첫 화면 모션 재생':'첫 화면 모션 일시정지');
  labToggle.textContent = labVideo.paused ? '▷' : 'Ⅱ';
  labToggle.setAttribute('aria-label',labVideo.paused?'조합 영상 재생':'조합 영상 일시정지');
}
heroToggle.addEventListener('click',()=>{heroWantsMotion=heroVideo.paused;heroInView=true;syncPlayback();});
labToggle.addEventListener('click',()=>{labWantsMotion=labVideo.paused;labInView=true;syncPlayback();});
[heroVideo,labVideo].forEach(video=>{video.addEventListener('play',updatePlaybackLabels);video.addEventListener('pause',updatePlaybackLabels);});
function choosePair(next){
  selected=next;
  document.querySelectorAll('[data-fragment]').forEach(button => button.setAttribute('aria-pressed',String(selected.includes(button.dataset.fragment))));
  document.getElementById('selection-count').textContent=selected.length+' / 2 선택';
  labToggle.disabled=selected.length!==2;
  if(selected.length!==2){
    labVideo.pause();labVideo.hidden=true;loading.hidden=false;
    loading.textContent=selected.length?'두 번째 조각을 선택하세요':'두 조각을 선택해 주세요';
    document.getElementById('combination-title').textContent=selected.length?selected[0].toUpperCase()+' + ?':'? + ?';
    document.getElementById('selection-status').textContent=loading.textContent;
    document.getElementById('combination-counter').textContent='— / 15';
    document.getElementById('video-progress').style.width='0%';
    return;
  }
  const ordered=fragments.filter(id=>selected.includes(id));
  currentPair=ordered.join('');
  const labels=ordered.map(id=>id.toUpperCase());
  document.getElementById('combination-title').textContent=labels.join(' + ');
  document.getElementById('combination-counter').textContent=String(pairs.indexOf(currentPair)+1).padStart(2,'0')+' / 15';
  document.getElementById('selection-status').textContent=labels.join(' + ')+' 조합을 감상해 보세요.';
  loading.hidden=false;loading.textContent='새로운 형태를 불러오는 중';labVideo.hidden=false;
  labVideo.poster='assets/motion/'+currentPair+'.jpg';
  labVideo.src='assets/motion/'+currentPair+'.mp4';
  labVideo.setAttribute('aria-label','선택한 '+labels.join('과 ')+'의 그래픽 조합 영상');
  labVideo.load();
  labVideo.playbackRate=Number(document.getElementById('motion-speed').value);
  syncPlayback();
}
document.querySelectorAll('[data-fragment]').forEach(button=>button.addEventListener('click',()=>{
  const id=button.dataset.fragment;
  if(selected.includes(id))choosePair(selected.filter(item=>item!==id));
  else choosePair([...selected.slice(-1),id]);
}));
document.getElementById('shuffle').addEventListener('click',()=>{
  const alternatives=pairs.filter(pair=>pair!==currentPair);
  const pair=alternatives[Math.floor(Math.random()*alternatives.length)];
  choosePair([pair.slice(0,2),pair.slice(2)]);
});
document.getElementById('motion-speed').addEventListener('input',event=>{
  const rate=Number(event.target.value);labVideo.playbackRate=rate;
  document.getElementById('speed-label').textContent=(Number.isInteger(rate)?rate.toFixed(1):String(rate))+'×';
});
labVideo.addEventListener('loadeddata',()=>{loading.hidden=true;});
labVideo.addEventListener('error',()=>{loading.hidden=false;loading.textContent='영상을 불러오지 못했어요. 다른 조합을 선택해 주세요.';});
labVideo.addEventListener('timeupdate',()=>{
  document.getElementById('video-progress').style.width=(Number.isFinite(labVideo.duration)?100*labVideo.currentTime/labVideo.duration:0)+'%';
});
const introDialog=document.getElementById('intro-dialog');
const introFilm=document.getElementById('intro-film');
let introClosing=false;
let introTimeout;
function releaseIntro(){
  clearTimeout(introTimeout);introFilm.pause();document.body.classList.remove('intro-open');syncPlayback();
}
function finishIntro(){
  if(introClosing || !introDialog.open)return;
  introClosing=true;introDialog.classList.add('is-leaving');introFilm.pause();
  window.setTimeout(()=>{introDialog.close();releaseIntro();},reducedMotion.matches?0:650);
}
document.getElementById('skip-intro').addEventListener('click',finishIntro);
introDialog.addEventListener('cancel',event=>{event.preventDefault();finishIntro();});
introDialog.addEventListener('close',releaseIntro);
introFilm.addEventListener('ended',finishIntro);
introFilm.addEventListener('error',finishIntro);
introFilm.addEventListener('timeupdate',()=>{
  document.getElementById('intro-progress-fill').style.width=(Number.isFinite(introFilm.duration)?100*introFilm.currentTime/introFilm.duration:0)+'%';
});
if(!reducedMotion.matches){
  introDialog.showModal();document.body.classList.add('intro-open');
  introTimeout=window.setTimeout(finishIntro,9000);
  introFilm.play().catch(finishIntro);
}
let heroPair='b1c1';
let heroBag=[];
let heroSwapTimer;
function nextHero(){
  if(!heroBag.length){
    heroBag=pairs.filter(pair=>pair!==heroPair);
    for(let i=heroBag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[heroBag[i],heroBag[j]]=[heroBag[j],heroBag[i]];}
  }
  const next=heroBag.pop();
  heroVideo.classList.add('is-changing');
  clearTimeout(heroSwapTimer);
  heroSwapTimer=window.setTimeout(()=>{
    heroPair=next;
    const label=next.slice(0,2).toUpperCase()+' + '+next.slice(2).toUpperCase();
    document.getElementById('hero-pair').textContent=label;
    heroVideo.poster='assets/motion/'+next+'.jpg';
    heroVideo.src='assets/motion/'+next+'.mp4';
    heroVideo.setAttribute('aria-label',label+' 그래픽 조각이 연결되고 움직이는 HUM 아트워크');
    heroVideo.load();syncPlayback();
    heroVideo.classList.remove('is-changing');
  },250);
}
heroVideo.addEventListener('ended',()=>{if(heroWantsMotion)nextHero();});
const mediaObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(entry.target===heroVideo)heroInView=entry.isIntersecting;
    if(entry.target===labVideo)labInView=entry.isIntersecting;
  }
  syncPlayback();
},{threshold:0.18});
mediaObserver.observe(heroVideo);mediaObserver.observe(labVideo);
document.addEventListener('visibilitychange',syncPlayback);
reducedMotion.addEventListener('change',()=>{heroWantsMotion=!reducedMotion.matches;labWantsMotion=!reducedMotion.matches;if(reducedMotion.matches)finishIntro();syncPlayback();});
const progress=document.querySelector('.reading-progress');
let scheduled=false;
function updateScroll(){const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?window.scrollY/max*100:0)+'%';scheduled=false;}
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}},{passive:true});
window.addEventListener('resize',updateScroll);updateScroll();
if(!reducedMotion.matches){
 document.body.classList.add('js-motion');
 const reveals=document.querySelectorAll('.story-layout,.device-layout,.interaction,.section-heading,.city-layout,.company-layout,.reveal');
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.08});
 reveals.forEach(el=>{el.classList.add('reveal');revealObserver.observe(el);});
}
const navigationObserver=new IntersectionObserver(entries=>{
 for(const entry of entries)if(entry.isIntersecting){document.querySelectorAll('.header nav a').forEach(link=>link.classList.toggle('is-active',link.getAttribute('href')==='#'+entry.target.id));}
},{rootMargin:'-20% 0px -45% 0px',threshold:0});
['device','archive','team'].forEach(id=>navigationObserver.observe(document.getElementById(id)));
const tilt=document.querySelector('[data-tilt]');
if(window.matchMedia('(hover: hover) and (pointer: fine)').matches){
 tilt.addEventListener('pointermove',event=>{if(reducedMotion.matches)return;const r=tilt.getBoundingClientRect();const x=(event.clientX-r.left)/r.width-.5;const y=(event.clientY-r.top)/r.height-.5;tilt.style.transform=`perspective(900px) rotateX(${-y*6}deg) rotateY(${x*6}deg)`;});
 tilt.addEventListener('pointerleave',()=>{tilt.style.transform='';});
}
document.getElementById('combination-counter').textContent=String(pairs.indexOf(currentPair)+1).padStart(2,'0')+' / 15';
updatePlaybackLabels();

// Signature-colour wave feedback; native focus and touch interaction remain intact.
const cursor=document.getElementById('cursor-orbit');
const rippleLayer=document.getElementById('ripple-layer');
const precisePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
function resetCursor(){document.body.classList.remove('has-custom-cursor');cursor.classList.remove('is-active','is-link');}
document.addEventListener('pointermove',event=>{
  if(event.pointerType!=='mouse'||!precisePointer.matches||reducedMotion.matches||introDialog.open){resetCursor();return;}
  const editing=event.target.closest('input:not([type=range]),textarea,[contenteditable=true]');
  if(editing){resetCursor();return;}
  document.body.classList.add('has-custom-cursor');cursor.classList.add('is-active');
  cursor.classList.toggle('is-link',Boolean(event.target.closest('a,button,summary,input[type=range]')));
  cursor.style.transform=`translate3d(${event.clientX}px,${event.clientY}px,0) translate(-50%,-50%)`;
},{passive:true});
document.addEventListener('pointerout',event=>{if(!event.relatedTarget)resetCursor();});
window.addEventListener('blur',resetCursor);
document.addEventListener('keydown',event=>{if(event.key==='Tab')resetCursor();});
reducedMotion.addEventListener('change',resetCursor);
document.addEventListener('pointerdown',event=>{
  if(event.button!==0||reducedMotion.matches||introDialog.open)return;
  const wave=document.createElement('span');wave.className='click-wave';
  if(event.target.closest('.device,.company-section,.team-section,.closing,.story,.city'))wave.classList.add('is-light');
  wave.style.left=event.clientX+'px';wave.style.top=event.clientY+'px';
  while(rippleLayer.children.length>=6)rippleLayer.firstElementChild.remove();
  rippleLayer.append(wave);wave.addEventListener('animationend',()=>wave.remove(),{once:true});
},{passive:true});
