---
layout: post
title: Animating the Cook County Court System
---

One of my research projects studies the effects of certain rule changes instituted in the Cook County State's Attorney's Office (SAO) by Kim Foxx, who was elected to the office over the incumbent Anita Alvarez in December 2016. 

Using data newly released by Foxx's office, [previous data journalism](https://pudding.cool/2019/10/prosecutors/) has shown that the proportion of incoming cases prosecuted as felonies has fallen sharply under her leadership. One reason for this change is that under Foxx, the SAO doubled the monetary threshold for felony prosecution of retail theft, from the previous minimum of $500 to the current value of $1000. The data shows that as soon as Foxx took office, both the number of shoplifting cases brought to the SAO *and* the proportion of these cases approved fell sharply:

![timeseries](https://i.ibb.co/mzSz8xK/shoplifting-ratio.png){:class="img-responsive"}

The data is special for another reason: it's one of the first widely available criminal justice datasets to follow cases over the entire life of the case, from arrest to sentencing. This is a big deal - public data on the criminal justice system [is notoriously spotty](https://www.theatlantic.com/politics/archive/2015/05/what-we-dont-know-about-mass-incarceration/394520/). The existing datasets usually only provide a snapshot of one component of the system, such as sentencing. But decisions made earlier in the criminal justice process, such as the charges filed, can dramatically affect sentencing outcomes at the end - for example, research has shown that [most of the racial disparity in federal criminal sentences stems from prosecutors' decisions to charge black defendants with harsher crimes](https://repository.law.umich.edu/cgi/viewcontent.cgi?article=2413&context=articles), *not* solely from discrimination by judges.

Here is a link to the visualization: [https://bl.ocks.org/michaelgalperin/880866ec6a8027517c504ec171dfab1e](https://bl.ocks.org/michaelgalperin/raw/880866ec6a8027517c504ec171dfab1e/)

Visualization to-dos:
- Embed d3 into this jekyll post instead of linking to an external URL (lame).
- Use repl `mix` to change point colors as they reclassify.
- Add delineating line for misdemeanors in between Class 4 and Class A.
- Make separate visualizations showing Class M felonies, Class X felonies, etc.
- Solve the problem of how to pass all parameters to repl in a single `vec4` (see [this](https://bl.ocks.org/1wheel/9b3bcc4ce8266913c0a0ddd4120a41de) post by Adam Pearce), so that all crime categories moving can be rendered at once. Although, I'm not sure that this would make it more understandable than showing one class moving across at a time.
