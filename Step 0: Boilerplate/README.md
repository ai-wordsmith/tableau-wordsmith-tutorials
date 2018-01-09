**NOTE: This set of tutorials is intended for developers interested in building fully custom Wordsmith and Tableau integrations. If you are not a developer, please log in to your Wordsmith account to access our knowledge base and other tutorials.**

# Step 0: Boilerplate

This step serves as a generic starting point for building a custom integration between Tableau and Wordsmith. This code consists of a front-end using HTML, CSS, and Javascript and a back-end built using Python 3 and Flask.

The code here should be viewed as a starting point for the steps that follow. This step, in isolation, will not provide a functional integration. Instead it is intended to give you a solid starting point on which to build.

# Code Structure

Much of the structure you see here is a byproduct of using Python's Flask microframework. Below is a high level reference, by folder, of what you'll find in this set of boilerplate code.

## root

| File Name | Purpose / Description |
|-----------|-----------------------|
| app.py | This is the entry point for our web app. This file designates routes for our app and performs our data aggregation. |

## root > templates

The `templates` directory is automatically recognized by Flask and used to serve HTML files (or templates, though we won't use the Jinja templating framework supported by Flask in our examples).

| File Name | Purpose / Description |
|-----------|-----------------------|
| index.html | The HTML file containing the layout for our front-end. |

## root > static

The `static` directory is also automatically recognized by Flask. This directory is generally where you'll store any dependencies (Javascript files, images, CSS files) referenced in your HTML files. It is a matter of preference but, for larger apps it can be helpful to subdivide this directory based on file types. That subdivision is present here though we will not be using the `img` or `css` directories.

| File Name | Purpose / Description |
|-----------|-----------------------|
| N/A | N/A |

### root > static > js

This subdirectory is where we will have all of our locally hosted Javascript files. For the purpose of these examples, we will use two different files but functionality can be split into more files if it makes sense.

| File Name | Purpose / Description |
|-----------|-----------------------|
| index.js | This is where all of our custom JS will reside. |
| tableauHelper.js | This file (available [here](https://github.com/ai-invent/tableau-helper)) is built as an abstraction layer for the Tableau Javascript API. The intent is to make it a little easier to work with the API. Using this file is entirely optional though these guides will rely heavily on it. |

### root > static > css

*This directory is intentionally empty.*

### root > static > img

*This directory is intentionally empty.*
