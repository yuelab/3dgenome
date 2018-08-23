<?php
error_reporting(E_ERROR);
ini_set('display_errors', 1);

$DEFAULT_BIN_MAX    = 6232;
$DEFAULT_RES_BIN    = 512;
$LIMIT_BIN_NUMBER   = 512;
$DEFAULT_BIN_NUMBER = 128;      //Number of bins to display when a gene is inputted

$setVal = False;

if (!empty($_GET))
{
    #source is inside (on the promoter server) or outside (at another server)
    $source     = filter_var($_GET['source'], FILTER_SANITIZE_STRING);

    $species    = filter_var($_GET['species'], FILTER_SANITIZE_STRING);
    $assembly   = filter_var($_GET['assembly'], FILTER_SANITIZE_STRING);

    $tissue     = filter_var($_GET['tissue'], FILTER_SANITIZE_STRING);
    $resolution = filter_var($_GET['resolution'], FILTER_SANITIZE_STRING);
    $type       = filter_var($_GET['type'], FILTER_SANITIZE_STRING);

    $c_url = filter_var($_GET['c_url'], FILTER_SANITIZE_URL);

    $gene  = filter_var(trim($_GET['gene']), FILTER_SANITIZE_STRING);
    $chr   = filter_var($_GET['chr'], FILTER_SANITIZE_STRING);
    $start = filter_var(trim($_GET['start']), FILTER_SANITIZE_STRING);
    $end   = filter_var(trim($_GET['end']), FILTER_SANITIZE_STRING);

    $sessionID = filter_var($_GET['sessionID'], FILTER_SANITIZE_URL);

    $window   = filter_var(trim($_GET['window']), FILTER_SANITIZE_STRING);

    $browser  = filter_var(trim($_GET['browser']), FILTER_SANITIZE_STRING);

    $chia_data = filter_var($_GET['chia_data'], FILTER_SANITIZE_STRING);

    if ( $mode == "heatmap" )
    {
        #Either gene or genomic coordinates need to be provided; for gene, genomic coordinates will be determined later
        if (isset($source) && isset($species) && isset($assembly) && ((isset($chr) && isset($start) && isset($end)) || isset($gene)))
        {
            #Need to provide a file url
            if ( $source == 'outside' && isset($c_url) )
            {
                $setVal=True;
                unset($tissue);
            }
            #Or tissue and resolution
            if ($source =='inside' && isset($tissue) && isset($resolution))
            {
                $setVal=True;
            }
        }
    }

    if ( $mode == "virtual4c" )
    {
        if (isset($source) && isset($species) && isset($assembly) && isset($gene))
        {
            if ($source == 'outside' && isset($c_url))
            {
                $setVal=True;
                unset($tissue);
            }
            if ($source =='inside' && isset($tissue))
            {
                $setVal=True;
            }
        }   
    }

    if ( $mode == "chiapet" )
    {
        if (isset($gene))
        {
            $setVal=True;
        }
    }

    if ( $mode == "chic" )
    {
        if (isset($gene))
        {
            $setVal=True;
        }
    }

    if ($mode == "interchrom")
    {
        if (isset($gene1) && isset($gene2))
        {
            $setVal=True;
        }
        if (isset($chr1) && isset($start1) && isset($end1) && isset($chr2) && isset($start2) && isset($end2) )
        {
            $setVal=True;
        }
    }

    $transfer = $_GET['transfer'];
    if ($transfer)
    {
        $setVal=False;
    }
}
?>
