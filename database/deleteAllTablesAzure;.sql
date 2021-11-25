USE safelog;

SELECT  'DROP TABLE [' + name + '];' 
FROM    sys.tables ORDER BY create_date DESC;