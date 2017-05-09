---
title: OSSLT Resources - WolverineNews.ca 
description: A set of interactive multiple choice quizzes based on the released 
             portions of the Ontario Secondary School Literacy Test that have 
             been released by EQAO.
---
{% extends 'layout.html' %}
{% block main %}
{% include 'header.html' %}


<div id="osslt-wrapper" class="pure-u-1 pure-u-md-3-4 pure-u-lg-3-5">

{% filter markdown %}
OSSLT Practice Tests
====================

On this page, you will find links to self-grading online quizzes made up of the
questions from past OSSLTs.  You can use these quizzes to get instant feedback
about the parts of the test you are strongest with, and which you should
practice more before attempting the OSSLT.

<div id="osslt-test-links" class="pure-g">
  <div class="pure-u-1 pure-u-md-1-3">
    <p>
      <a href="osslt/2007-2008">2007-2008 OSSLT Released Questions</a>
    </p>
    <p>
      <a href="osslt/2008-2009">2008-2009 OSSLT Released Questions</a>
    </p>
    <p>
      <a href="osslt/2009-2010">2009-2010 OSSLT Released Questions</a>
    </p>
  </div>
  <div class="pure-u-1 pure-u-md-1-3">
    <p>
      <a href="osslt/2010-2011">2010-2011 OSSLT Released Questions</a>
    </p>
    <p>
      <a href="osslt/2011-2012-sample-test">2011-2012 OSSLT Sample Test</a>
    </p>
    <p>
      <a href="osslt/2011-2012-released-questions">2011-2012 OSSLT Released Questions</a>
    </p>
    <p>
      <a href="osslt/2012-2013">2012-2013 OSSLT Released Questions</a>
    </p>
  </div>
  <div class="pure-u-1 pure-u-md-1-3">
    <p>
      <a href="osslt/2013-2014">2013-2014 OSSLT Released Questions</a>
    </p>
    <p>
      <a href="osslt/2014-2015">2014-2015 OSSLT Released Questions</a>
    </p>
    <p>
      <a href="osslt/2015-2016">2015-2016 OSSLT Released Questions</a>
    </p>
  </div>
</div>

##OSSLT Question Types
There are several different types of questions on the OSSLT.  If you practice 
being able to identify which type of question you're looking at, you will have
an easier time giving a full-mark answer.


###Multiple Choice

There are two types of multiple choice questions on the OSSLT:

__Direct__

*Direct* questions are questions which can be answered by copying information
directly from the text, like dates, names, ages, etc.

[Strategies for answering direct questions](#)

__Indirect__

*Indirect* questions require you to figure something out. The OSSLT will often
ask indirect questions like "What happened first?" or "Which word has the
closest meaning?"

[Strategies for answering indirect questions](#)

###Short Answer

There are three types of short answer questions on the OSSLT:

__Open Response__

In *Open Response* questions, you are asked to combine the material you read 
with your own experience to answer a question.

[Strategies for answering open response questions](#)
    
__Short Writing__

In *Short Writing* questions, you are asked to look at the reading material 
exclusively when answering a question. 

[Strategies for answering short writing questions](*)


__Information Paragraph/Main Idea__

In *Main Idea* questions, you are asked to provide a main idea and at least one 
detail that supports it.

[Strategies for answering main idea questions](#)


###News Report

*News Reports* should follow established conventions from news media.  In these
questions, you should use the headline and photo provided to write a short
news story.

[Strategies for writing news reports](#)


###Series of Paragraphs/Opinion Piece

In the *Series of Paragraphs Expressing an Opinion*, you will answer a
question provided by EQAO in several paragraphs.  This is the longest piece of
writing on the OSSLT, so good planning is very important.

[Strategies for writing opinion pieces](#)

{% endfilter %}

</div>
{% endblock main %}
