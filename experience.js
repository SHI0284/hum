/* A small, session-only collection of the forms you discover. */
(() => {
 const root=document.documentElement;
 const palette=document.querySelector('.palette');
 const moodNames=['아침의 온기','오후의 여유','저녁의 잔향','밤의 고요','새로운 하루'];
 const moodColors=['#ffe8b9','#b8dee3','#91b8e0','#7e8da9','#f2f2f2'];
 const moodHead=document.createElement('div');
 moodHead.className='mood-heading';
 moodHead.innerHTML='<div><span class="mono">03 / COLOUR YOUR MOMENT</span><h3>지금, 어떤 시간에 머물고 있나요?</h3></div><p id="mood-status" role="status">오후의 여유 · 색을 눌러 분위기를 바꿔보세요.</p>';
 palette.before(moodHead);
 [...palette.children].forEach((tile,i)=>{
   const button=document.createElement('button');button.type='button';button.className='mood-swatch '+tile.className;
   button.style.cssText=tile.style.cssText;button.innerHTML=tile.innerHTML+'<span class="mood-check" aria-hidden="true">↗</span>';
   button.setAttribute('aria-label',moodNames[i]);button.setAttribute('aria-pressed',String(i===1));tile.replaceWith(button);
   button.addEventListener('click',()=>{
     root.style.setProperty('--mood',moodColors[i]);
     palette.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
     document.getElementById('mood-status').textContent=moodNames[i]+' · 나의 순간에 색을 입혔어요.';
   });
 });
 const stage=document.querySelector('.sound-lab');
 stage.before(moodHead,palette);
 const collection=document.createElement('div');collection.className='discovery';
 collection.innerHTML='<div class="discovery-heading"><span class="mono">YOUR FORM COLLECTION</span><span id="discovery-count" role="status">0 / 15 발견</span></div><div class="discovery-grid" aria-label="발견한 그래픽 조합"></div><p>만난 형태가 이곳에 모여요. 다시 눌러 감상해 보세요.</p>';
 stage.after(collection);
 const discovered=new Set();const grid=collection.querySelector('.discovery-grid');
 pairs.forEach((pair,i)=>{
   const b=document.createElement('button');b.type='button';b.disabled=true;b.dataset.pair=pair;
   b.setAttribute('aria-label',pair.slice(0,2).toUpperCase()+' + '+pair.slice(2).toUpperCase()+' 아직 발견하지 않은 조합');
   b.innerHTML='<span class="mono">'+String(i+1).padStart(2,'0')+'</span>';
   b.addEventListener('click',()=>choosePair([pair.slice(0,2),pair.slice(2)]));grid.append(b);
 });
 function discover(){
   if(selected.length!==2)return;
   discovered.add(currentPair);
   grid.querySelectorAll('button').forEach(b=>{
     b.setAttribute('aria-pressed',String(b.dataset.pair===currentPair));
     if(discovered.has(b.dataset.pair)&&b.disabled){
       b.disabled=false;b.classList.add('is-discovered');
       b.setAttribute('aria-label',b.dataset.pair.slice(0,2).toUpperCase()+' + '+b.dataset.pair.slice(2).toUpperCase()+' 다시 보기');
       const img=document.createElement('img');img.src='assets/motion/'+b.dataset.pair+'.jpg';img.alt='';b.prepend(img);
     }
   });
   document.getElementById('discovery-count').textContent=discovered.size+' / 15 발견'+(discovered.size===15?' · 모든 형태를 만났어요!':'');
 }
 new MutationObserver(discover).observe(document.getElementById('combination-title'),{childList:true});discover();
 const next=document.createElement('button');next.type='button';next.className='motion-control next-form';next.textContent='다음 형태 ↗';
 next.addEventListener('click',nextHero);document.querySelector('.motion-hero figcaption').append(next);
 // Pointer light is local to the artwork; no continuous animation loop.
 document.querySelectorAll('.lab-stage,.motion-hero').forEach(el=>{
   el.addEventListener('pointermove',event=>{
     if(reducedMotion.matches||event.pointerType!=='mouse')return;
     const r=el.getBoundingClientRect();el.style.setProperty('--light-x',((event.clientX-r.left)/r.width*100)+'%');el.style.setProperty('--light-y',((event.clientY-r.top)/r.height*100)+'%');
   },{passive:true});
 });
})();

