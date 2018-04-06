<?php

namespace UglifyPHP;

class CSS extends Uglify
{
    protected static $location = 'cleancss';
    protected static $exists_check = '';
    protected static $options = array('keep-line-breaks', 'compatibility', 'skip-import', 'timeout', 'rounding-precision', 's0');
    protected static $option_place = 'before';
}
