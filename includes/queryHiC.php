<?php

$con = mysqli_connect('localhost', 'yzw125', '3352', 'hic');
$database_bool = 1;
$mysql_result = array();
$mysql_result['species']    = array('human', 'mouse');
function executeQuery($field, $con, $sql)
{
    global $mysql_result;
    $mysql_result[$field] = array();

    $result = mysqli_query($con, $sql);
    if ($result)
    {
        while ($row = $result->fetch_assoc())
        {   
            $r = $row[$field];
            array_push($mysql_result[$field], $r);
        }
    }
    else
    {
        global $database_bool;
        $database_bool = 0;
    }
}
$table_name = "datasets";
if ($con)
{
    mysqli_select_db($con,"hic");

    if (!$species)
    {
        $species = $mysql_result['species'][0];
    }
    $sql="SELECT DISTINCT assembly FROM $table_name WHERE species='$species' ORDER BY assembly DESC;";
    executeQuery("assembly", $con, $sql);   

    if (!$assembly)
    {
        $assembly = $mysql_result['assembly'][0];
    }
    $sql="SELECT DISTINCT tissue FROM $table_name WHERE assembly='$n_assembly';";
    executeQuery("tissue", $con, $sql);

    if (!$tissue)
    {
        $tissue = $mysql_result['tissue'][0];
    }
    $sql="SELECT DISTINCT chr  FROM $table_name WHERE assembly='$n_assembly' AND tissue='$tissue';";
    executeQuery("chr", $con, $sql);

    $sql="SELECT DISTINCT type FROM $table_name WHERE assembly='$n_assembly' AND tissue='$tissue';";
    executeQuery("type", $con, $sql);

    if (!$type)
    {

        $type = $mysql_result['type'][0];
    }
        $sql="SELECT DISTINCT resolution FROM $table_name WHERE assembly='$n_assembly' AND tissue='$tissue' AND type='$type' ORDER BY resolution DESC;";
        executeQuery("resolution", $con, $sql);

    if (!$resolution)
    {
        $resolution = $mysql_result['resolution'][0];
    }

    $sql="SELECT DISTINCT publication FROM $table_name WHERE assembly='$n_assembly' AND tissue='$tissue' AND type='$type' AND resolution='$resolution';";
    executeQuery("publication", $con, $sql);

    if (! ($mysql_result['assembly'] && $mysql_result['tissue'] && $mysql_result['chr'] ) )
    {
        $database_bool = 0;
    }
}
else
{
    $database_bool = 0;
}

if (! $database_bool)
{
    $species = 'human';
    $mysql_result['assembly']   = array('hg19', 'hg18');
    #$mysql_result['tissue']     = array('GM12878', 'HMEC', 'HUVEC', 'IMR90', 'K562', 'KBM7', 'NHEK');
    $mysql_result['tissue']     = array('GM12878', 'HMEC', 'HUVEC', 'IMR90', 'K562', 'KBM7', 'NHEK', 'H1-ESC', 'H1-MES', 'H1-MSC', 'H1-NPC', 'H1-TRO', 'Thymus_STL001', 'Aorta_STL002', 'VentricleLeft_STL003', 'Liver_STL011','T470','SKNMC','SKNDZ','SKMEL5','SJCRH30','RPMI7951','PANCI','NCIH460','LNCaP','G401','Caki2','A549');
    $mysql_result['resolution'] = array('25', '10', '5', '1');
    $mysql_result['chr'] = array();
    for ($i = 1; $i <= 22; $i++)
    {
        array_push($mysql_result['chr'], "chr".$i);
    }
    array_push($mysql_result['chr'], "chrX");
    #$mysql_result['type'] = array('raw');
    $mysql_result['type'] = array('Lieberman-raw', 'Lieberman-VC-norm', 'Lieberman-KR-norm', 'Lieberman-SQRTVC-norm', 'Dixon2012-raw');
}

?>
