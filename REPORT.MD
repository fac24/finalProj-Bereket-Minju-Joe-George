<!--

Here are two guides from FAC describing what this report should contain:

- https://learn.foundersandcoders.com/course/handbook/project-documentation/
  (Note: this currently refers to writing a "README", which.. isn't necessarily correct.)

- https://hackmd.io/@kd32zKu_SymvWskEr4gE3g/SySUj11aK
  (Note: this might be out of date!)

-->

# Project report

## <mark>(To be completed at the beginning/early stages of the project:)</mark>


## Introduction

### What are you building?

- A directions app that allows users to be able to set a start and end point to plan their route, access platform interchanges as well as exits for a better journey experience.
- The ability to input the users own experience of where to stand / get off the train, that will update for other users


### Why are you building it?
- To make user have a less stressful/more pleasant journey, have more time for other things, and (hopefully) have less far to travel between trains/station exits.


## Project scope


### What are you not building?
- Showing users the least crowded carriages.
- A full journey-planning app, e.g.:
  - Other modes of (public) transport (walking, bus, bike, cab, etc.).
  - End-to-end routing (from specific address to another).

### How did you decide what features were important?

- Group discussion.
- The amount of time we have available.
- The cost/accessibility of map APIs (e.g. Google Maps).
- Initial user/usability research.
- Primary focus being the implementation of the main functionality of accessing station interchnages/ exits.



## Project plan

### How are you going to structure your sprints?
- Assign total sprint points in total for a particular feature 
- break down task into smaller bit and allocate points weighing it against the Actual time ??
- calculate sprint based on those numbers 

**<mark>(new heading added)</mark>**



### What order are you going to build in?
- Project setup (probably ``npx create-next-app``).
- Get rid of unwanted template garbáge.
- Set up ElephantSQL.
- Test deployment on Vercel.
- Create database schema, deploy to local, add test data.
- Build landing page using components.
- Start/end station search.
- Basic route-finding with TfL API.
  - List valid routes on "new route" page.
- "Find my location" to provide start point.
- Carriage/door recommendation ("train diagram" page).
- Feedback system.
- Saved routes page.
- Stretch goals, e.g.:
  - Map for start/end point location.
  - etc.

#### After Week 1 Sprint
- Build order pretty much followed and finished up to "Find my location"
- Saved routes has been moved up to between "Find my location" and Carriage/door recommendation
- A start has been made on both carriage/door and saved routes recommendation with the latter being almost complete

### ~~How will you delegate work?~~

**<mark>(this heading has been removed, but we could consider it merged with the sprint structure one above)</mark>**
- Refer to the each role that team member is assigned.

### How did user research inform your plan? 

**<mark>(new heading added)</mark>**

- Provided valuable feedback in terms of user journey which was taken into consideration when designing the app   

## Requirement analysis

### How will you ensure your project is accessible to as many users as possible?
- Prioritise the accessibility with lighthouse in chrome dev tool.
- Web accessibility guidlines 
- Ensure it can be navigated without mouse (i.e. keyboard only).
- Make sure train diagrams are compatible with screen-readers (e.g. they should read out "enter the third carriage by the second door to exit on the same side", or similar).

### Are there any legal or regulatory requirements you should consider?

- No legal/ regulatory requirments however we followed TFL's guidlines when using their publicly available API

**<mark>(new heading added)</mark>**


___


## <mark>(To be completed after the project is done/towards the end :)</mark>


### Project learnings

#### Did your team work effectively?


#### What would you do differently next time?



## Research and findings

**<mark>(new heading added, but seems to duplicate the new heading about user research above, which is in a better position in the document, so let's ignore this one?)</mark>**

### What did you find out from user testing?



## Project outcomes

### Were your assumptions right or wrong?

**<mark>(new headings added, but is this a project outcome? This seems to relate more to the user research bit, when we considered our assumptions...)</mark>**


### Recommendations and conclusions

#### What features would you prioritise to build next?


#### Was the project a success?


___


## Software Development Lifecycle stages <mark>(new section!)</mark>

### Planning

- What roles did your team take on?

> Explain the roles and responsibilities of all people working within the software development lifecycle, and how they relate to the project (K2)

- Did these roles help your team work effectively?

> Outline how teams work effectively to produce software and how to contribute appropriately (K6) Compare and contrast the requirements of a software development team, and how they would ensure that each member (including themselves) were able to make a contribution (K6)

### Analysis

- What might be the intended and unintended consequences of building this product?

### Design

- How did you plan a user experience?
- What technical decisions did you make?
  - Server-render vs client-render vs both
  - Relational or non-relational or no DB
  - Self-hosted or platform-as-a-service
  - Frontend first vs DB first
- Did you create a technical specification?

> Review methods of software design with reference to functional/technical specifications and apply a justified approach to software development (K11, S11, S12)

### Implementation/Build

- How did you ensure your code was good?

> Create logical and maintainable code to deliver project outcomes, explaining their choice of approach. (S1)

- What interesting technical problems did you have to solve?

> Outline and apply the rationale and use of algorithms, logic and data structures. (K9, S16)

- How did you debug issues that arose?

> Apply structured techniques to problem solving to identify and resolve issues and debug basic flaws in code (S7)

### Test

- How did you verify your project worked correctly?

> Identify and create test scenarios which satisfy the project specification (S6)

- Did writing automated tests catch any bugs?

> Analyse unit testing results and review the outcomes, correcting errors. (S4)

### Deploy

- Where/how did you deploy your application?

> Review and justify their contribution to building, managing and deploying code into the relevant environment in accordance with the project specification (S10)

- What problems did you encounter during deployment?

### Maintain

- Is it easy for someone make changes to the codebase?
- Could a new person quickly be onboarded to contribute?
