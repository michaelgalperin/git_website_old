---
layout: post
title: Animating the Cook County Court System
---

There's a link at the bottom, but in case you don't want to read this whole thing, here's the visualization: [https://bl.ocks.org/michaelgalperin/880866ec6a8027517c504ec171dfab1e](https://bl.ocks.org/michaelgalperin/880866ec6a8027517c504ec171dfab1e)

---

In December 2016, Kim Foxx was elected State's Attorney of Cook County, Illinois, the second-largest prosecutor's office in the country by caseload. 

Foxx ran as a reform candidate, vowing to reform the city's bond system, increase police accountability, and shift her office's resources away from prosecuting low-level crimes and towards more aggressive prosecution of violent crimes. After she took office, she also released over eight years of data, tracking every felony case in Cook County from arrest to sentencing.

[Previous data journalism](https://pudding.cool/2019/10/prosecutors/) has used the data to show that Foxx's office pursues fewer felonies than her predecessor, Anita Alvarez. In some cases, this change reflects new rules instituted by Foxx's office. For example, immediately upon taking office, Foxx doubled the monetary threshold for felony prosecution of retail theft in Cook County. The data shows that the proportion of shoplifting cases approved as felonies fell sharply:

![timeseries](https://i.ibb.co/mzSz8xK/shoplifting-ratio.png){:class="img-responsive"}

The data is special for another reason: it's one of the first widely available criminal justice datasets to follow cases over the entire life of the case, from arrest to sentencing. This is a big deal - public data on the criminal justice system [is notoriously spotty](https://www.theatlantic.com/politics/archive/2015/05/what-we-dont-know-about-mass-incarceration/394520/). 

Existing datasets usually only provide a snapshot of one component of the system, such as sentencing. But decisions made earlier in the criminal justice process, such as the charges filed, can dramatically affect sentencing outcomes at the end - for example, [research](https://repository.law.umich.edu/cgi/viewcontent.cgi?article=2413&context=articles) has shown that [most of the racial disparity in federal criminal sentences stems from *prosecutors'* decisions to charge black defendants with harsher crimes, not solely from discrimination by judges.

I used the data to visualize the evolution of one case outcome over a case's lifespan: the felony class of a case. The class of a felony, which affects minimum standards for punishment if a defendant is found guilty, is recorded *twice* in the data: once when a case is brought in to the State's Attorney's Office for Felony Review, and once at disposition, when a decision is reached. The process between these two points can take years, and can have huge consequences for defendants' lives. 

For example, [journalists](https://www.theatlantic.com/magazine/archive/2017/09/innocence-is-irrelevant/534171/) and [academics](https://digitalcommons.law.yale.edu/cgi/viewcontent.cgi?article=7446&context=ylj) alike have argued that guilty pleas, the method of resolution of over 95 percent of cases, can threaten justice. The risk of losing a case that goes to trial can encourage innocent defendants to plea guilty to low-level offenses rather than expend the time, money, and risk required to argue against a more serious charge in court.

The visualization shows that the felony class of a case is often downgraded over a case's life. It also gives an idea of the relative amount of time it takes to resolve cases of various classes (surprise: murders take the longest to resolve).

Here is a link to the visualization: [https://bl.ocks.org/michaelgalperin/880866ec6a8027517c504ec171dfab1e](https://bl.ocks.org/michaelgalperin/880866ec6a8027517c504ec171dfab1e)

<div id='graph'></div>

Visualization to-dos:
- Embed javascript into this jekyll post instead of linking to an external URL (lame).
- Use repl `mix` to change point colors as they reclassify (although this makes felonies of different origins indistinguishable at disposition).
- Add delineating line for misdemeanors in between Class 4 and Class A.
- Solve the problem of how to pass all parameters to repl in a single `vec4` (see [this](https://bl.ocks.org/1wheel/9b3bcc4ce8266913c0a0ddd4120a41de) post by Adam Pearce), so that all crime categories moving can be rendered at once instead of just a few of them. Although, I'm not sure that this would make it more understandable than showing one class moving across at a time.
