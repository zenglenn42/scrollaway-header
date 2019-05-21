![alt](docs/img/cm-logo.png)

# City Match

Find your city.

# Designer's Log

![alt](docs/img/oasis.png)

The Starlight terrace at the Oasis is busy. It's Saturday night which means the music could be rock, soul funk, tribute or a mix. Tonight it's rock.

It's a varied demographic, mostly middle aged married couples getting their groove on with a mix of younger folk watching and enjoying the sunset.

And then he appears.

Early 30's, jean jacket, glasses, long hair, and a red bandana. He calibrates with the band, offering up some fist pumps to the middle-aged rockers.

![alt](docs/img/fist-pump.png)

Later, he approaches the stage and holds up his Bic lighter high in appreciation.

I'm not sure what the band thinks of all this singular devotion. I'm guessing a rush of tipsy soccer mom's would be more their speed, but the point is, this guy has found his tribe and feels he belongs. And isn't that the bottom line?

## Big Data and the Search for Home

Sure, there are instrinsic qualities that allow us to feel comfortable in a variety of environments. But the external world still matters vitally. Scale, economics, culture, community all affect how we relate to and feel about a place. So in a world of options, can big-data expand our awareness and help us find that viable place where we'll feel most at home given our resources?

[City Rank](https://github.com/zenglenn42/CityRank/blob/master/README.md), a 2-week software bootcamp project, explored that idea a bit. However there's only so much that can be done in such a short time.

City Match is an effort to realize the promise of City Rank by improving the user experience with thoughtful front-end design, hardening the code for better performance, and implementing some desired features.

## Thumb Ninja

My focus shifts from the stage to a nearby table where a woman whips out her phone and fluidly navigates through texts and images, powered by the grace of her thumb.

`Tap, tap, swish, scroll. Tap, tap, swish.`

There's an ease and comfort here that seem very natural. I want City Match to be that easy to navigate.

![alt](docs/img/thumb-ninja.png)

![alt](docs/img/thumb-usability.png)

In the morning, I come up with this:

![alt](docs/img/ui-design.jpg)

Three screens:

- landing page
- preference page
- results page

all thumb-navigable by a floating action button near the footer. The results page also features multiple views on the same data:

- list view
- image view
- chart view
- map view

On desktop, I could see offering more than one view at a time. But right now, I'm thinking about mobile mostly. That's the plan.

Even though playing with [Material Design components](https://getmdl.io/components/index.html) is a major goal of this UI redesign, I still want to make sure I understand some of the underlying layout tools offered by modern CSS (especially since MDL builds atop some of those tools).

## Flexy FAB Landing Page

Here's my first cut at a pure CSS floating action button centered about the footer edge. This is done with flexbox (to flex the main section and yield a sticky footer), absolute positioning, and a sweet little calc expression to horizontally center the fab at (50% - 1/2 button width). With some SASS variables, I could make this more DRY.

I'll probably employ a media query to limit the max-size of the button on larger viewports, otherwise I get a truncated button. Not horrible, but also not great.

![alt](docs/img/flex-landing.png)

## Grid-based Preference Page

I'll employ some kind of responsive grid layout for the preference slider cards.

My first effort illustrates how grid geometries can easily spill over the available space:

![alt](docs/img/grid-play-1.png)

I discover flex-ratio (fr) units and my grid-cells nicely fit to the viewport, preserving ratios:

![alt](docs/img/grid-play-2.png)

But with the preference cards that host the sliders, I want something that collapses down to fit at least 1 card width on mobile platforms. I'm thinking auto-fit might be the key. Exploring that next.

## Not a Horrible CSS Grid

After much point, click, and cursing, I have a responsive grid. It also scrolls nicely within its own div so the footer and fab button below that div always stay visible even with a lot of content.

![alt](docs/img/grid-prefs.png)

Ruefully, I notice my slider cards often don't fall within thumb range with the current positioning. :-/ But I've burned my layout energy for the day and I'm ready to relax. CSS is an interesting goddess. She enables much, but you have to prove yourself worthy.

![alt](docs/img/kali.jpg)
[Image](https://flic.kr/p/xWDRiU) courtesy Debansu Saha (by NC-SA-2.0 license).

Oh, btw, I've add some fu to get my fab button to shrink and grow in proportion to the viewport, but with size limiters at both extremes to keep things from getting ridiculous on retina or large displays or smaller devices. City Match on iWatch some day?

## Grid-based Results Page

This is a wholesale grab of the preferences page for the content area, but I tuck a nifty flex row below it for buttons that will control the view on our results data. The buttons will morph to icons in time.

I also subtly tweak the colors to go with my pastel motif. Not sure I'll keep these, but they are more pleasing than what I have above. I basically soften up the header, footer, and fab colors. It's all very Miami. :-)

![alt](docs/img/grid-results.png)

The cool thing on mobile are the data format buttons. They're in the thumb-zone, so we have a nice usability win here.

Within the flex-ified button div, I use the option:

`justify-content: center;`

with a whisper of left/right button margin for accessibility and proximity to the floating action button (fab).

The layout and styling could use some polish. For example, I feel the button bar cries out for a top-bar of some sort to keep the balance. And maybe that space between the button bar and footer is a slightly odd dead-zone. Could I wedge some monetization in there without be annoying? I could see stacking those two bars and having the fab push the middle option buttons to either side. But I feel I'm in the good enough category at the moment and I want to get some Material Design going and to get this thing /wired up/ to the backend.

The other cool thing is I have more than just wireframes here. I have actual code and behavior that is responsive thanks to the super powers for flexbox and grid. So I could easily hand this off to an awesome designer for them to riff-on and evolve so it's inviting and chock full of affordance.

![alt](docs/img/nyc1.jpg)
Photo by Reynaldo Brigantty (#brigworkz)

## Material Design Lite in the House

Here's my first pass at an MDL-based landing page on mobile.

![alt](docs/img/mdl-landing.png)

I may switch out the picture for something sunnier, but there are several things I like about the image:

- It's charming!

  - The star filter on the street lights and framing of the crescent moon are almost whimsical.
  - The time-lapse river of orange and yellow is lovely and vibrant.

- The image is not identifiable with any /specific/ city.

  - I want something suggestive that doesn't show bias for a particular city in the landing.
  - That, or have a montage kind of thing of several cities. Possibly a tasteful carousel if it's not too busy.

- [Image](https://www.pinterest.com/pin/742179213570198708/) is courtesy [imageocra](https://www.pinterest.com/imageorca/)

MDL has opinions about stuff ... like color. I'm trying to avoid a bunch of custom colors and simply rely upon defaults like 'primary' for nav bar and fab. Do you notice the footer, by default, is not solid black? Looks like my instinct to lighten my pure CSS footer above aligns with MDL's default sensibilities.

![alt](docs/img/golden-dawn.jpg)
Image courtesy Beto Franklin.

I wake up this morning with a solution for the results page 'dead-zone' under the view buttons. Just stick to my original design on mobile of morphing the footer into a bottom-app bar and let the buttons live in the sticky footer area. Much more pattern-ful, I think. On desktop, I could see having a dedicated results area that floats above the footer and /contains/ the button bar giving better locality of task for larger displays. I'll try to make that happen with some media queries.

The 'list', 'image', 'chart', and 'map' buttons become icons adjacent to the fab on mobile, eliminating that odd dead-space between the gray button-bar and footer on the left.

![alt](docs/img/view-buttons.png)

For now, I want to get the MDL-based preference page cleaned up and doc'd. I'm really enjoying this design exercise probably because it engages very different parts of my brain than my coding-brain. I'm learning a visual vocabulary and getting better at expressing what's in my mind's eye with CSS.

I notice my repo is starting to get cloned, so others must be interested in my exploration as well. (-;

## MDL-based Preferences Page

MDL has a clean look and I'm trying not to clutter it up with background images behind my cards.

Here's the preference 'slider' page. The switches at the bottom of the cards enable & disable preferences users don't care about.

![alt](docs/img/mdl-prefs.png)

I'll probably add a 'guidance' card at the top that simply invites users to select their preferences. This will provide context and enhance usability by pushing the other sliders closer to the thumb region.

Notice on mobile how the preference card subtly disappears /before/ it hits the floating action button? I think it looks better than tucking behind the button and footer and reduces chance of fat-finger hits between slider and fab button.

Maybe with offscreen preferences (especially on mobile), the fab will remain gray and inactive (or even hidden) until the user scrolls all the way to the bottom of the content just so they don't miss any options before triggering the results pages.

💡It would be easy enough to add a filter for limiting the search to specific states:

![alt](docs/img/select-states.png)

With the scrollable preference window, the app scales to an endless array of selectable options. For minimal viable product (MVP), I'll stick to the 4 preferences I have above. Once the VC clears, all sorts of scalability plays can happen. (-;

## MDL-based Results Page

![alt](docs/img/mdl-results.png)

I mock up some results cards and implement the view buttons in the bottom app-bar. I may add text for them as well. I'm using a spacer-button with 'visibility: hidden' in the middle to 'push' the other view buttons away from the floating action button.

I also figure out how to customize the primary and secondary colors on the [MDL site](https://getmdl.io/customize/index.html). So I could come up with more of a teal-based look to match the teal tones in the landing page.

![alt](docs/img/mdl-landing-customized.png)

This thing is looking real.

![alt](docs/img/beach-sunset.jpg)

## Onto the Controller

I need to bring up a controller that listens for button clicks and switches page views. But I'm blocked. My mojo is just not here today. I've been working at this pretty hard for the past week and I need a break. The UI design is in good shape and with fresh eyes, I'm hopeful the controller will emerge in the fullness of time.

## Turning the Page

![alt](docs/img/page-turn.jpg)
Photo by Pixabay

I've come to a decision on my HTML. This is a relatively small app from a front-end perspective and I could just inline all 3 pages worth of HTML and maybe do the whole jQuery _.hide() / _.show() thing for each page-level div.

But there is a /lot/ of repetition in the markup with MDL cards that only differ in a few attributes. Seems a safe bet to either use templates or programmatically generate the content with parameterized helper functions.

Though I want to improve my vanilla javascript chops, I think I will lean on my frenemy, jQuery, since he has some ready idioms for enabling event delegation to dynamically created DOM children with buttons and sliders and such. Maybe as a-post MVP exercise, I may redo this in pure js since I know it's good for me.

With that decision out of the way, I can focus on the primitives I'll need to build out the HTML dynamically.

![alt](docs/img/finished-sprint.jpg)
Photo by Tim Gouw

Ok, that was not bad at all. My HTML is dynamic. Now I need to wire up the buttons.

But before that, a non-linear thought from a previous conversation wells up.

## "How does it make money?"

She's attractive, uses a mac, and happens to order an old fashioned, one of my faves. But we're both plugged-in and laptop-busy at a brewpub with plenty of outlets at the bar so I focus on the task at hand. But you never know where inspiration and insight might strike, so I enage her briefly as she closes out.

She brings her laptop over and shows me a lush vacation-based website she's rolling out. It's stunning. Turns out she's in marketing. In the spirit of sharing, I show her the city app. She's polite with feedback but cuts to the chase by asking "How does it make money?" At first, I'm slightly wounded. Creativity is an act of vulnerability. Brene Brown talks about this beautifully. You carefully nurture your baby from toddlerhood to promising teenager, urging them on a path of self-actualization that includes economic viability but doesn't necessarily prioritize that above all else. But I take the feedback with grace as she parts. Maybe I need more conversations like this.

I've seen plenty of sites with tacky, slapped-on monetization ploys that are jarring and distracting from the visual aesthetic and overall user goal. But commerce makes the world go round, so is there a graceful way to design for this essential requirement?

It occurs to me that taking user preferences and distilling them into a ranked set of target cities opens up a universe of possibilities in the results section that could be /localized/ for that short-list.

I'm thinking about:

- Movers
- Realtors
- Apartement locators
- Job recruiters
- Major employers
- Educational institutions

With some stylistic guidelines, such monetization cards could be blended into the output without looking horrible:

![alt](docs/img/monetize-results.png)
