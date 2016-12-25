---
title: OSSLT Resources - WolverineNews.ca 
description: A set of interactive multiple choice quizzes based on the released portions of the Ontario Secondary School Literacy Test that have been released by EQAO.
---
{% extends 'layout.html' %}
{% block main %}
{% include 'header.html' %}


<div class="pure-u-1">

  {% filter markdown %}
  [2007-2008 OSSLT](/tools/osslt/2007-2008)
  {% endfilter %}

</div>
{% endblock main %}
