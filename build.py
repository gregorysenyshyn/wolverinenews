#!/usr/bin/env python3

import os
import glob
import time
import shutil
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
js_paths = {'dist/static/js/app.js': ['sheets.js',
                                      'app.js'],
            'dist/static/js/osslt.js': ['osslt.js'],
            'dist/static/js/index.js': ['index.js'],
            'dist/static/js/records.js': ['records.js'],
            'dist/static/js/teams.js': ['teams.js'],
            'dist/static/js/calculators.js': [ 'calculators.js' ],
            'dist/static/js/announcements.js': ['sheets.js',
                                                'repos/Twitter-Post-Fetcher/js/twitterFetcher.js',
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

SCSS_PATHS = {'dist/static/css/app.css': ['base.css',
                                          'buttons-core.css',
                                          'buttons.css',
                                          'grids.css',
                                          'grids-responsive.css',
                                          'menus-core.css',
                                          'menus-horizontal.css',
                                          'menus-dropdown.css',
                                          'app.scss',
                                          'osslt.scss'],
              'dist/static/css/announcements.css': ['base.css',
                                                    'grids.css',
                                                    'announcements.scss']}
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
data = {'pagesets': [{'files': [{'src': ['src/pages/*.html',
                                         'src/pages/*.md',
                                         '!src/pages/announcements.html'],
                                'dest': ''},
                                {'src': ['src/pages/tools/*.html',
                                         'src/pages/tools/*.md'],
                                 'dest': 'tools'}],
                      'partials': ['src/partials/main/*.html'],
                      'layouts': 'src/layouts/layout.html',
                      'options': {'section': False}},

                      {'files': [{'src': ['src/pages/osslt/2007-2008.yaml'],
                                  'dest': 'osslt'}],
                       'partials': ['src/partials/osslt/*.html',
                                    'src/partials/main/head.html',
                                    'src/partials/main/header.html',
                                    'src/partials/main/footer.html'],
                       'layouts': ['src/layouts/layout.html',
                                   'src/layouts/osslt.html'],
                       'options': {'section': False,
                                   'template': 'osslt.html'}},

                     {'files': [{'src': 'src/pages/announcements.html',
                                 'dest': ''}],
                       'partials': ['src/partials/announcements/*.html'],
                       'layouts': 'src/layouts/layout.html',
                       'options': {'section': False}}
                     ],
        'options': {'s3 bucket': 'wolverinenews.ca',
                    'local prefix': 'dist/pages',
                    'local static': 'dist'}
        }


# ######## #
#  IMAGES  #
# ######## #

IMAGES ={ 
        'copy': [
            {'dist/static/images': ['src/images/copy/*']}
            ]
        }


def copy_images():
    for item in IMAGES['copy']:
        for dest_path in item:
            os.makedirs(dest_path)
            file_list = tools.GlobLoader(item[dest_path]).files
            for file in file_list:
                print('Copying {0} to {1}...'.format(os.path.basename(file),
                                                     dest_path), end="")
                shutil.copyfile(file, os.path.join(dest_path,
                                                   os.path.basename(file)))
                print(' Done!')

if __name__ == '__main__':
    print(chr(27) + "[2J")
    print('Starting build!')
    t1 = time.time()
    production = False
    if len(argv) > 1 and argv[1] == 'production':
        production = True

    tools.clean()
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
    copy_images()

    print('\n\n=== H T M L ===')
    tools.main(data['pagesets'], data['options'], s3, production)

    if production:
        print('\n\n=== S T A T I C   F I L E S ===')
        tools.move_static('dist/static',
                          s3,
                          s3_bucket_name,
                          data['options']['local static'])
    print('\n\n=== Entire build done in {0} seconds ==='.format(
        round(float(time.time() - t1), 4)))
