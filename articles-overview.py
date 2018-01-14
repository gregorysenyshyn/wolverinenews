#!/usr/bin/env python3

import os
import re
import csv
import glob 
import frontmatter

article_dirs = ['src/pages/editorial/2017-2018/articles/*','src/pages/news/2017-2018/*']
overview_output = 'student_overview'
articles_csv_output = 'articles.csv'

class Article:
    title = None
    article_type = None
    word_count = 0

class Student_Overview:

    def __init__(self):
        self.statistics = {'student name':'',
                           'word count': 0,
                           'article count': 0,
                           'review/preview complete': False,
                           'business profile complete': False}

        self.articles = [] 


    def __setitem__(self, key, value):
        self.__dict__[key] = value

    def __getitem__(self, key):
        return self.__dict__[key]


def get_articles():
    '''gets article files from article_dirs
    '''
    article_files = []
    for article_dir in article_dirs:
        for article in glob.glob(article_dir, recursive=True):
            article_files.append(article)
    return article_files

def get_article(fm_article):
    '''creates an article object for a supplied article file
    '''
    article = Article()
    article.title = fm_article.metadata['title']
    if 'type' in fm_article.metadata:
        article.article_type = fm_article.metadata['type']
    fm_article.content = re.sub('<.*?>','',fm_article.content)
    fm_article.content = re.sub('{%.*?%}','',fm_article.content)
    fm_article.content = re.sub('\n','',fm_article.content)
    article.word_count = len(fm_article.content.split())
    return article

def get_student_overview(student_name, overview_data):
    '''looks for a student name in overview_data, and creates a new 
       Student_Overview if no match is found
    '''
    for overview in overview_data:
        if overview.statistics['student name'] == student_name:
            return overview
    overview = Student_Overview()
    overview.statistics['student name'] = student_name
    overview_data.append(overview)
    return overview


articles = get_articles()
overview_data = []
for article in articles:
    if os.path.isfile(article) and article.endswith('.html'):
        fm_article = frontmatter.load(article)
        student_overview = get_student_overview(
                fm_article.metadata['author'], overview_data)
        current_article = get_article(fm_article)
        if current_article.article_type == 'repre':
            student_overview['review/preview complete'] = True
        if current_article.article_type == 'busprof':
            student_overview['business profile complete'] = True
        student_overview.articles.append(current_article)
overview_data.sort(key=lambda x: x.statistics['student name'])
overview_output_string = ''
for student in overview_data:
    student.statistics['article count'] = len(student.articles)
    for article in student.articles:
        if article.article_type not in ['repre', 'busprof']:
            student.statistics['word count'] = student.statistics['word count'] + article.word_count
    average_word_count = student.statistics['word count']/ student.statistics['article count']
    overview_output_string += (f'{student.statistics["student name"]}\n#############\nAverage Word Count per Article - {average_word_count}\nNumber of Articles - {student.statistics["article count"]}\n\n\n')
with open(overview_output, 'w', newline='') as overview_file:
    overview_file.write(overview_output_string)

with open(articles_csv_output, 'w', newline='') as csv_file:
    csv_writer = csv.writer(csv_file) 
    for student in overview_data:
        for article in student.articles:
            csv_writer.writerow([student.statistics['student name'],
                                 article.title,
                                 article.article_type,
                                 article.word_count])
