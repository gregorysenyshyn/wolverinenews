#!/usr/bin/env python3

import os
import glob
import time
import json
import shutil
import subprocess
from sys import argv

import boto3
import sass
from slimit import minify as jsminify

import tools

# ####### #
#  UTILS  #
# ####### #


def search_include_paths(target_filename, include_paths):
    for include_path in include_paths:
        search_file = os.path.join(include_path, target_filename)
        if os.path.isfile(search_file):
            return search_file
    raise FileNotFoundError("Can't find {0}".format(target_filename))


def concat_files(glob_paths, include_paths=None):
    '''Takes a list of filenames and combines the contents of those files into
    one string
    '''
    files = []
    for path in glob_paths:
        globbed_paths = glob.glob(path)
        if globbed_paths:
            for file in globbed_paths:
                if os.path.isfile(file):
                    files.append(file)
        elif include_paths:
            files.append(search_include_paths(path, include_paths))
        else:
            raise FileNotFoundError("Can't find {0}".format(path))
    return_string = ''
    for current_file in files:
        with open(current_file, 'r') as f:
            return_string += f.read()
    return return_string

# #### #
#  JS  #
# #### #

js_include_paths = ['src/js/']
js_paths = {'dist/js/app.js': ['sheets.js',
                               'app.js'],
            'dist/js/osslt.js': ['osslt.js'],
            'dist/js/index.js': ['index.js'],
            'dist/js/records.js': ['records.js'],
            'dist/js/teams.js': ['teams.js'],
            'dist/js/calculators.js': [ 'calculators.js'],
            'dist/js/announcements.js': ['sheets.js',
                                         'announcements.js' ]
           }


def write_js_file(destination, js_string, production):
    with open(destination, 'w') as f:
        # if production:
        #     f.write(jsminify(js_string))
        # else:
        f.write(js_string)


def handle_js(production):
    for dest_path in js_paths:
        t1 = time.time()
        print('Generating {0}...'.format(dest_path), end="")
        if dest_path.endswith('.js'):
            os.makedirs(os.path.split(dest_path)[0], exist_ok=True)
            js_string = concat_files(js_paths[dest_path], js_include_paths)
            write_js_file(dest_path, js_string, production)
        else:
            os.makedirs(dest_path, exist_ok=True)
            for glob_path in js_paths[dest_path]:
                for js_file in glob.glob(glob_path):
                    dest_filename = '{0}.js'.format(os.path.splitext(
                        os.path.basename(js_file))[0])
                    js_string = ''
                    with open(js_file, 'r') as f:
                        js_string = f.read()
                    write_js_file(os.path.join(dest_path, dest_filename),
                                  js_string,
                                  production)
        print(' Done in {0} seconds'.format(round(float(time.time() - t1), 4)))


# ###### #
#  CSS   #
# ###### #

SCSS_PATHS = {'dist/css/app.css': ['app.scss', 'osslt.scss'],
              'dist/css/announcements.css': ['announcements.scss']}
LOADPATH = ['src/scss/']


def write_css_file(destination, scss_string, production):
    with open(destination, 'w') as f:
        if production is True:
            f.write(sass.compile(string=scss_string,
                                 output_style='compressed',
                                 include_paths=LOADPATH))
        else:
            f.write(sass.compile(string=scss_string,
                                 include_paths=LOADPATH))


def handle_scss(production):
    for dest_path in SCSS_PATHS:
        t1 = time.time()
        print('Generating {0}...'.format(dest_path), end="")
        if dest_path.endswith('.css'):
            os.makedirs(os.path.split(dest_path)[0], exist_ok=True)
            scss_string = concat_files(SCSS_PATHS[dest_path], LOADPATH)
            write_css_file(dest_path, scss_string, production)
        else:
            os.makedirs(dest_path, exist_ok=True)
            for glob_path in SCSS_PATHS[dest_path]:
                for scss_file in glob.glob(glob_path):
                    dest_filename = '{0}.css'.format(os.path.splitext(
                        os.path.basename(scss_file))[0])
                    scss_string = ''
                    with open(scss_file, 'r') as f:
                        scss_string = f.read()
                    write_css_file(os.path.join(dest_path, dest_filename),
                                   scss_string,
                                   production)
        print(' Done in {0} seconds'.format(round(float(time.time() - t1), 4)))


# ###### #
#  HTML  #
# ###### #
# 'section-pages' option can only create an index of one directory at a time

data = {'pagesets': [
         {'files': [
           {'src': ['src/pages/*.html',
                    'src/pages/*.md',
                    '!src/pages/announcements.html'],
            'template': 'layout.html',
            'dest': ''},
           {'src': ['src/pages/tools/*.html', 'src/pages/tools/*.md'],
            'template': 'layout.html',
            'dest': 'tools'}],
          'partials': ['src/partials/main/*.html'],
          'layouts': ['src/layouts/layout.html'],
          'options': {}},

         {'files': [
           {'src': ['src/pages/osslt/*.yaml'],
            'template': 'osslt.html',
            'dest': 'osslt'}],
          'partials': ['src/partials/osslt/*.html',
                       'src/partials/main/*.html',
                       '!src/partials/main/scripts.html'],
          'layouts': ['src/layouts/layout.html', 'src/layouts/osslt.html'],
          'options': {}},

         {'files': [
           {'src': 'src/pages/editorial.html',
            'template': 'layout.html',
            'dest': '',
            'options': {'section pages': ('src/pages/editorial/'
                                          '2017-2018/articles'),
                        'section pages prefix': 'editorial'}},
           {'src': 'src/pages/news.html',
            'template': 'layout.html',
            'dest': '',
            'options': {'section pages': ('src/pages/news/'
                                          '2017-2018'),
                        'section pages prefix': 'news'}},
           {'src': ['src/pages/news/2017-2018/*.html'],
            'template': 'news-article.html',
            'dest': 'news'},
           {'src': ['src/pages/editorial/2017-2018/articles/*.html'],
            'template': 'editorial-article.html',
            'dest': 'editorial'},
           {'src': ['src/pages/editorial/2017-2018/qanda.yaml'],
            'template': 'qanda.html',
            'dest': 'editorial'},
           {'src': ['src/pages/editorial/2017-2018/meme-of-the-week.yaml'],
            'template':'meme-of-the-week.html',
            'dest': 'editorial'}],
        'partials': ['src/partials/editorial/*.html',
                     'src/partials/main/*.html'],
        'layouts': ['src/layouts/layout.html',
                    'src/layouts/qanda.html',
                    'src/layouts/meme-of-the-week.html',
                    'src/layouts/editorial-article.html',
                    'src/layouts/news-article.html'],
        'options': {}},

       {'files': [{
           'src': 'src/pages/announcements.html',
           'template': 'layout.html',
           'dest': ''}],
        'partials': ['src/partials/announcements/*.html'],
        'layouts': 'src/layouts/layout.html',
        'options': {}}
       ],
      'options': {
            's3 bucket': 'wolverinenews.ca',
            'prod': 'dist',
            'images': None
            }
        }


# ############ #
#  COPY FILES  #
# ############ #

COPY_FILES = {data['options']['prod']: ['src/apache/.htaccess']}

def copy_files():
    for dest_path in COPY_FILES:
        if not os.path.exists(dest_path):
            os.makedirs(dest_path)
        file_list = tools.GlobLoader(COPY_FILES[dest_path]).files
        for file in file_list:
            print((f'Copying {os.path.basename(file)} to {dest_path}'
                    '...'), end="")
            shutil.copyfile(file, os.path.join(dest_path,
                                               os.path.basename(file)))
            print(' Done!')

def get_local_config(path='local_config.json'):
    local_config = None
    with open(path) as f:
        local_config = json.load(f)
    return local_config


if __name__ == '__main__':
    print(chr(27) + "[2J")
    print('Starting build!')
    t1 = time.time()
    production = False
    local_config = get_local_config();

    print('\n\n=== C L E A N ===')
    print(f'cleaning {data["options"]["prod"]}...', end='')
    tools.clean(data['options']['prod'])
    print(' Done!')

    if len(argv) > 1 and argv[1] == 'production':
        production = True

    s3=None

    if production:
        ## AWS ##
        s3_bucket_name = data['options']['s3 bucket']
        print('\n\n=== A W S ===\n\nCleaning {0}'.format(s3_bucket_name))
        s3 = boto3.resource('s3')
        s3_bucket = s3.Bucket(s3_bucket_name)
        for key in s3_bucket.objects.all():
            key.delete()

    print('\n\n=== C S S ===')
    handle_scss(production)

    print('\n\n=== J S ===')
    handle_js(production)

    print('\n\n=== I M A G E S ===')
    if data['options']['images'] is None:
        data['options']['images'] = local_config['images']
    image_src = f'{data["options"]["images"]}'
    image_dest = f'{data["options"]["prod"]}'

    print((f'linking {image_src} to {image_dest}...'), end='')
    subprocess.run(['ln', '-s', image_src, image_dest])
    print(' Done!')

    print('\n\n=== H T M L ===')
    tools.main(data['pagesets'], data['options'], s3, production)

    print('\n\n=== C O P Y   F I L E S ===')
    copy_files()

    if production:
        print('\n\n=== S T A T I C   F I L E S ===')
        tools.move_static('dist/static',
                          s3,
                          s3_bucket_name,
                          data['options']['prod'])
        print('\n\n=== Entire build done in',
              f'{round(float(time.time() - t1), 4)} seconds ===')
