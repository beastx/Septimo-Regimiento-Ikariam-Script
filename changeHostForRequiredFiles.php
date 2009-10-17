#!/usr/bin/php
<?
function getFiles($dir, $ext, $exclude = array()) {
    $returnList = array();
    $nextDirs = array();
    if ($dh = opendir($dir)) {
        while (($file = readdir($dh)) !== false) {
            if ($file != '.' && $file != '..') {
                if (is_dir($file)) {
                    array_push($nextDirs, $file);
                } else {
                    $info = pathinfo($dir . '/' . $file);
                    if ($info['extension'] == $ext) {
                        $dontInclude = false;
                        for ($l = 0; $l < count($exclude); ++$l) {
                            if (strtolower($file) == strtolower($exclude[$l])) {
                                $dontInclude = true;
                            }
                        }
                        if (!$dontInclude) {
                            array_push($returnList, $file);
                        }
                    }
                }
            }
        }
        closedir($dh);
    }
    for ($i = 0; $i < count($nextDirs); ++$i) {
        $newFiles = getFiles($dir . '/' . $nextDirs[$i], $ext, $exclude);
        for ($j = 0; $j < count($newFiles); ++$j) {
            array_push($returnList, $nextDirs[$i] . '/' . $newFiles[$j]);
        }
    }
    return $returnList;
}

function changeHostForFile($host, $path, $file) {
    $lines = file($path . '/' . $file);
    $newCcontent = array();
    echo "-------------------------------------------------------------------------------\nFile: " .$file . "\n";
    foreach ($lines as $line_num => $line) {
        if (VAR_startsWith('// @require', $line)) {
            array_push($newCcontent, changeHostInLine($host, $line));
        } else {
            array_push($newCcontent, $line);
        }
    }
    $handle = fopen($path . '/' . $file, "w+");
    for ($i = 0; $i < count($newCcontent); ++$i) {
        if (fwrite($handle, $newCcontent[$i]) === false) {
            echo "Cannot write to text file. <br />";
        }
    }
    fclose($handle);
}

function changeHostInLine($host, $line) {
    global $changes;
    $pattern = '#^// @require               http://([^/]+)(.+)$#i';
    $replacement = '// @require               ' . $host . '$2';
    $result = preg_replace($pattern, $replacement, trim($line));
    echo $result . "\n";
    $changes++;
    return $result. "\n";
}

function VAR_startsWith($textToFind, $completeText) {
    if (mb_substr($completeText, 0, mb_strlen($textToFind)) == $textToFind) {
        if ($completeText == $textToFind) {
            return '';
        } else {
            return mb_substr($completeText, mb_strlen($textToFind));
        }
    } else {
        return false;
    }
}

$changes = 0;
$path = dirname(__FILE__);
$files = getFiles($path, 'js', array('WorldInfo.js', 'Log.js'));

for ($i = 0; $i < count($files); ++$i) {
    changeHostForFile('http://ikariam.beastx', $path, $files[$i]);
}

echo "-------------------------------------------------------------------------------\n" .$changes . " cambios realizados\n";
?>
