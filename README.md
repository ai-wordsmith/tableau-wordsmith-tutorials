**NOTE: This set of tutorials is intended for developers interested in building fully custom Wordsmith and Tableau integrations. If you are not a developer, please log in to your Wordsmith account to access our knowledge base and other tutorials.**

# Tableau + Wordsmith Integration Tutorials

These tutorials are designed to help understand the process of building a Tableau + Wordsmith integration.

# Requirements

This set of tutorials was built using Python 3.5 but should work on any Python 3.x version. If you do not already have Python 3, check Python's [Setup and Usage Instructions](https://docs.python.org/3/using/index.html) for details on how to get and install Python. Note that if you already have Python 2 installed, you will need to make sure you use the appropriate `python` and `pip` commands for Python 3. Frequently, when Python 2 is already installed, these commands are `python3` and `pip3` but this may vary depending on your specific setup.

The code in all of these examples was built to use the [TableauHelper JS Library](https://github.com/ai-invent/tableau-helper) and the [Tableau Data Python Library](https://github.com/ai-invent/tableau-data-python) along with a minimal number of external dependencies. Where 3rd party libraries are used, they are typically common libraries that should be familiar to and readily available for anyone familiar with the specific language.

## Javascript

| Dependency Name | Description |
|-----------------|-------------|
| Tableau Javascript API | This is the official API library supplied by Tableau. This enables a user to programmatically get data and interact with an embedded visualization.|
| jQuery | This is a common library that makes working with an HTML UI easier. |

## Python

| Dependency Name | Description |
|-----------------|-------------|
| Flask | Flask provides an easy framework on which to build a web application. For the purposes of these examples, Flask is used to serve our front-end and build an end point that receives data and returns narrative. |
| Requests | Requests is an HTTP library for Python that greatly simplifies the process of working with web services. For our purposes, we'll be using Requests to POST data to Wordsmith. |

# Sample Viz

All of the examples in this set will use the [YTD Sales by Product](https://public.tableau.com/profile/austin.bello2812#!/vizhome/YTDSalesbyProduct/YTDSalesbyProduct) viz available on Tableau Public.

## Tableau Public vs Server vs Online

While our sample viz is hosted on Tableau Public, functionality will be consistent between Public, Server, and Online. However, there are some quirks that you should be aware of. In particular, default sort order may differ between Public, Server, and Online. As an example, if you are dealing with a line chart based on time series data, Tableau Public may return data in ascending order by date while Tableau Server may return the same data in descending order. Generally, as a rule of thumb, it isn't safe to assume that order will be preserved between different Tableau platforms.

# Architecture

The general architectural flow of a Tableau + Wordsmith integration is to use the [Tableau Javascript API](https://onlinehelp.tableau.com/current/api/js_api/en-us/JavaScriptAPI/js_api_ref.htm) to pull either summary data or the full underlying dataset after the viz loads and/or when certain events occur (like a filter change, a mark selection, etc.).

The data that you pull from Tableau is passed to your back-end. The back-end is responsible for aggregating the tabular data from Tableau into a Wordsmith-ready format. Once the data is Wordsmith-ready, the back-end passes the data to the Wordsmith API and receives narrative as a response. This narrative is passed back to the front-end and displayed.

# Notes

For a production solution, you will likely want to utilize one of the many Javascript libraries that transpiles code and provides deployed JS with deep cross-browser support. However, for the purpose of these walkthroughs, we will generally use vanilla JS. The JS in these examples has been tested on Chrome and should also run on Firefox. Other browsers are likely to be more unpredictable.